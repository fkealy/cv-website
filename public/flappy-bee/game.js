//select canvas
const cvs = document.getElementById("bee");
const ctx = cvs.getContext("2d");

//game vars
let frames = 0;
const DEGREE = Math.PI/180;

function resize() {
	// Our canvas must cover full height of screen
	// regardless of the resolution
	var width;
	var height;

	if(window.innerWidth > window.innerHeight) {
	    //landscape
	    height = window.innerHeight;
	    var ratio = cvs.width/cvs.height;
	    width = height * ratio;
	}else {
	    // So we need to calculate the proper scaled width
	    // that should work well with every resolution
	    width = window.innerWidth;
	    var ratio = cvs.height/cvs.width;
	    height = width * ratio;
    }
	cvs.style.width = width+'px';
	cvs.style.height = height+'px';

}

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);


//Load sprite sheet
const sprite = new Image();
sprite.src = "img/sprite.png";

const bee = {
    animation : [
     { sX : 4, sY :  12},
     { sX : 124, sY : 12},
     { sX : 72, sY : 12},
     { sX : 124, sY : 12},
    ],
    w : 48,
    h : 32,
    x : 150,
    y : 50,
    radius : 6,
    frame : 0,
    speed: 0,
    rotation: 0,
    gravity: 0.25,
    jump: 4.6,

    draw : function(){
        let bee = this.animation[this.frame];

        ctx.save();
//        ctx.translate(this.x, this.y);
//        ctx.rotate(this.rotation);
        ctx.drawImage(sprite,bee.sX,bee.sY,this.w,this.h,this.x - this.w/2,this.y,this.w,this.h);
//        ctx.restore();

    },

    update : function(){
        // IF THE GAME STATE IS GET READY STATE, THE bee MUST FLAP SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;


        if(state.current == state.getReady){
            this.y = 250; // RESET POSITION OF THE bee AFTER GAME OVER
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
//                    DIE.play();
                }
            }

//            // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE bee IS FALLING DOWN
//            if(this.speed >= this.jump){
//                this.rotation = 90 * DEGREE;
//                this.frame = 1;
//            }else{
//                this.rotation = -25 * DEGREE;
//            }
        }

    },

    fly : function() {
        this.speed = - this.jump;
    },

     speedReset : function(){
            this.speed = 0;
     }
}

const pipes = {
    position : [],
    bottom : {
        sX : 268,
        sY : 0
    },
    top : {
        sX : 312,
        sY : 0
    },
    w: 36,
    h: 184,
    gap: 120,
    maxYPos : -30,
    dx: 2,

    update: function() {
           if(state.current !== state.game) return;

                if(frames%100 == 0){
                    this.position.push({
                        x : cvs.width,
                        y : this.maxYPos * ( Math.random() + 1)
                    });
                }
                for(let i = 0; i < this.position.length; i++){
                    let p = this.position[i];

                    let bottomPipeYPos = p.y + this.h + this.gap;

                    // COLLISION DETECTION
                    // TOP PIPE
                    if(bee.x + bee.radius > p.x && bee.x - bee.radius < p.x + this.w && bee.y + bee.radius > p.y && bee.y - bee.radius < p.y + this.h){
                        state.current = state.over;
//                        HIT.play();
                    }
                    // BOTTOM PIPE
                    if(bee.x + bee.radius > p.x && bee.x - bee.radius < p.x + this.w && bee.y + bee.radius > bottomPipeYPos && bee.y - bee.radius < bottomPipeYPos + this.h){
                        state.current = state.over;
//                        HIT.play();
                    }

                    // MOVE THE PIPES TO THE LEFT
                    p.x -= this.dx;

                    // if the pipes go beyond canvas, we delete them from the array
                    if(p.x + this.w <= 0){
                        this.position.shift();
                        score.value += 1;
//                        SCORE_S.play();
                        score.best = Math.max(score.value, score.best);
                        localStorage.setItem("best", score.best);
                    }
                }
    },

    draw: function() {
     for(let i  = 0; i < this.position.length; i++){
                let p = this.position[i];

                let topYPos = p.y;
                let bottomYPos = p.y + this.h + this.gap;

                // top pipe
                ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

                // bottom pipe
                ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
            }
     },

     reset : function(){
             this.position = [];
     }
}

const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,

    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);

        }else if(state.current == state.over){
            // SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225, 133);
            ctx.strokeText(this.value, 225, 133);
            // BEST SCORE
            ctx.fillText(this.best, 225, 160);
            ctx.strokeText(this.best, 225, 160);
        }
    },

    reset : function(){
        this.value = 0;
    }
}

const startBtn = {
    x : 40,
    y : 228,
    w : 104,
    h : 44
}


const fg = {
    sX: 0,
    sY: 344,
    w: 224,
    h: 56,
    x: 0,
    y: cvs.height - 56,

    dx : 2,

    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

const getReady = {
    sX : 8,
    sY : 92,
    w : 184,
    h : 20,
    x : cvs.width/2 - 184/2,
    y : 80,

    draw : function() {
        if(state.current == state.getReady){
        ctx.drawImage(sprite,this.sX, this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
        }
    }
}

const tapToStart = {
     sX : 8,
     sY : 68,
     w : 252,
     h : 20,
     x : cvs.width/2 - 252/2,
     y : 180,

     draw : function() {
         if(state.current == state.getReady){
         ctx.drawImage(sprite,this.sX, this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
         }
     }
}

const title = {
     sX : 8,
     sY : 296,
     w : 220,
     h : 40,
     x : cvs.width/2 - 252/2,
     y : 120,

     draw : function() {
         if(state.current == state.getReady){
         ctx.drawImage(sprite,this.sX, this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
         }
     }
}


const gameOver = {
     sX : 8,
     sY : 116,
     w : 184,
     h : 80,
     x : cvs.width/2 - 184/2,
     y : 80,

     draw : function() {
         if(state.current == state.over){
         ctx.drawImage(sprite,this.sX, this.sY,this.w,this.h,this.x,this.y,this.w,this.h);
         }
     }
}


//Game State
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// Control the game
cvs.addEventListener("click", function(evt){
    switch(state.current) {
        case state.getReady:
            state.current = state.game;
            break;
        case state.game:
            if(bee.y - bee.radius <= 0) return;
            bee.fly();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
                pipes.reset();
                bee.speedReset();
                score.reset();
                state.current = state.getReady;

            break;

    }
});


//draw
function draw(){
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    pipes.draw();
    bee.draw();
    fg.draw();
//    getReady.draw();
    tapToStart.draw();
    title.draw();
    gameOver.draw();
    score.draw();

}

//update
function update(){
    bee.update();
    pipes.update();
    fg.update();
}

function loop(){
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();