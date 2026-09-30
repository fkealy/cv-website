---
title: "Building Agreed: the first 80% took a day"
description: "16 weeks building a group decision app with AI. What the AI did, what it didn't, and why family and friends ran the real design review."
pubDate: 2026-09-30
tags: ["agreed", "ai", "product"]
---

[Agreed](https://getagreed.app) is a group decision app. Everyone swipes on their own phone and it finds the overlap. Baby names, where to go for the stag do, where to eat once you're there. It went live on the App Store on 7 September and on Google Play 10 days later.

I built it with Claude Code. Of the 1,626 commits so far, nearly all have Claude on them as a co-author. So this is a post about building with AI, but mostly it's about the parts the AI didn't do.

## The first 80% took a day

The first commit went in on 9 June: a React app on Convex, lists written by AI through OpenRouter, deployed to Cloudflare. By the end of that same day it had live multiplayer rooms, a pass-the-phone mode for groups sharing one device, and saved results.

That's the 80%. It looked like the thing. You could make a list, send a link and swipe with your mates. If I'd shown it to someone that evening they'd have said it was nearly done.

It wasn't. The native apps came a month later. The first App Store submission bounced because Apple's pre-check assumed there was a login it couldn't get past. Sign-in is optional, but I still had to build a demo account for the reviewer. And most of the summer went on the part a demo can't show you: what happens when someone else picks it up.

## The last 20% can't be prompted

I'm not sure the 80/20 point is original. Every engineer knows the last bit takes the longest. What AI changes is how lopsided it gets. When the first 80% arrives in a day, the last 20% is nearly all of the work.

And that 20% isn't more code. It's refinement, the product doing what people expect without them having to think about it. You can't prompt your way there, because the AI doesn't know where people get stuck. Neither did I, until I watched them.

So the loop that mattered was slow and human. Put a build in front of someone, watch what they do, change it and try again. From August every change could go straight to TestFlight and the Play testing track, so a tester could have a fix the same afternoon. The AI made each turn of that loop faster. It couldn't do the watching.

## From listicle generator to swiping

The biggest change came out of that loop. Agreed started as a list generator. You asked for board games to play, the AI wrote a list, you reviewed and edited it, and then everyone swiped.

The review step was where people stopped. Nobody wanted to edit a list. They wanted to get to the swiping. So on 10 September swipe-first became the default: you ask, and you land straight in the cards. If the options are off, you steer the AI as you go and the next cards change.

It sounds like a small change. It meant the list stopped being the thing you own and became something that happens in the background, which reached into naming, history and half the screens.

## Family and friends are the real design review

The stores are live, but Agreed is still in friends-and-family testing, on purpose.

A couple of people tried it for the first time, looking for somewhere to eat. Both stalled after the first pick, because nothing on screen told them to keep going. I'd been through that screen hundreds of times and never seen it. The fix was mostly words: "Make my list" became "Give me my options", and the optional extras folded away.

The same session showed they didn't know what to do with their first card. My first go at a hint pointed at the wrong control, and my note on it was "this is worse". The version that shipped shows the swipe on the card itself.

AI can write that screen in minutes. It can't sit next to someone who has never seen it and watch where their thumb goes. Back in August I built 5 "mum-grade" prototypes of the create flow, and that's still the bar.

## Taste needs a lid

This is the one I'm still learning. When the AI will build anything you describe by lunchtime, the backlog stops being limited by time. It's limited by judgement, and mine isn't always switched on.

I've made over 100 prototypes for Agreed. I've cut a welcome screen, a decisions archive, a round checkpoint, and a coin system that turned into a simple weekly allowance. There are 7 more features on the roadmap up for retirement right now, including a calendar and a browser clipper. Each was a good idea on its own. Together they made a product nobody could explain in a sentence.

The number that keeps me honest is 1.34. That was the average number of people in a session when I wrote down the quality bar in August. Agreed works fine on your own, but sharing is the product. The whole point is sending the link and finding the overlap between you, and no card animation gets a second person into the room. So the backlog gets sorted by one thing: whether it gets more people swiping together. Most of what I'd like to build doesn't.

## Where it is now

The rule for going wider is in the roadmap: widen when tester feedback is "quick understanding and delight, not confusion". Almost there.

It's on [the web](https://getagreed.app), the [App Store](https://apps.apple.com/us/app/agreed-decide-together/id6789555845) and [Google Play](https://play.google.com/store/apps/details?id=app.getagreed).
