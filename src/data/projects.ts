// Shared project list. `extra: true` keeps a project off the front page and
// puts it on /concepts instead — ideas still being tested.
// Projects with a `slug` + `story` get the expanding panel on the front page;
// screenshots live at /assets/work/{slug}-desktop.jpeg and {slug}-mobile.jpeg.
export interface Project {
  title: string;
  year: string;
  blurb: string;
  link?: string;
  /** App Store listing, shown as a second link in the front-page panel. */
  appStore?: string;
  tags: string[];
  /** Where it runs — shown on the front-page work rows instead of the tech tags. */
  deploy?: string;
  extra?: boolean;
  slug?: string;
  story?: string;
}

export const projects: Project[] = [
  {
    title: 'Agreed',
    year: '2026',
    blurb: 'Swipe to match on group decisions: baby names, where to do your stag do, the best place to eat when you get there. Everyone swipes and it surfaces what you all agree on. Now on the App Store.',
    link: 'https://getagreed.app',
    appStore: 'https://apps.apple.com/us/app/agreed-decide-together/id6789555845',
    tags: ['three.js', 'GSAP', 'Vite', 'Cloudflare', 'iOS'],
    deploy: 'Runs on Cloudflare',
    slug: 'agreed',
    story: 'Everyone swipes on their own phone and the app finds the overlap. No arguing, no spreadsheet. Started on the web, now an iPhone app too. Vite and three.js doing the theatrics, Cloudflare doing the serving.',
  },
  {
    title: 'Death House',
    year: '2026',
    blurb: 'A stickman brawler set in Death\'s house, with a small spirit in tow and a public speedrun leaderboard.',
    link: '/death-house/',
    tags: ['three.js', 'Convex'],
    extra: true,
  },
  {
    title: 'Doggins',
    year: '2026',
    blurb: 'A gym session planner that tracks lifting and running in one place. AI program generation, launching soon.',
    link: 'https://doggins.app',
    tags: ['AI', 'Fitness'],
    extra: true,
    slug: 'doggins',
    story: 'Lifting and running in one plan, instead of 2 apps that ignore each other. AI writes the programme, the tracker keeps you honest. In beta now, launching soon.',
  },
  {
    title: 'Yotpoint',
    year: '2024',
    blurb: 'A marketplace where superyacht crews find vetted service providers. Ours, built from scratch.',
    link: 'https://yotpoint.com',
    tags: ['Next.js', 'AWS Lambda', 'DynamoDB'],
    deploy: 'Runs on AWS',
    slug: 'yotpoint',
    story: 'The practice’s own marketplace. Next.js up front, Node and Lambda behind, DynamoDB underneath. New features ship without breaking what’s already live.',
  },
  {
    title: 'Emotional Scripture',
    year: '2024',
    blurb: 'A small web app that maps emotions to scripture across religions.',
    link: 'https://emotionalscripture.pages.dev/',
    tags: ['Vue', 'Cloudflare Pages'],
    deploy: 'Runs on Cloudflare',
    slug: 'emotional-scripture',
    story: 'Pick how you feel, get scripture that meets you there, across several religions. A small Vue app on Cloudflare Pages. Costs nothing to run.',
  },
  {
    title: 'Latch Log',
    year: '2024',
    blurb: 'A feed and nappy tracker for new parents. Offline-first PWA with analytics.',
    link: 'https://latchlog.pages.dev',
    tags: ['Vue', 'Convex', 'PWA'],
    extra: true,
  },
  {
    title: 'Villa La Mole',
    year: '2020',
    blurb: 'Booking site and owner dashboard for a holiday home in the south of France.',
    link: 'https://www.villalamole.com',
    tags: ['Vue', 'React', 'Convex'],
    deploy: 'Runs on Convex',
    slug: 'villa-la-mole',
    story: 'A holiday home that needed bookings without the agency fees. A site for guests, a dashboard for the owner, Convex keeping the calendar straight.',
  },
];

export const featuredProjects = projects.filter((p) => !p.extra);
export const extraProjects = projects.filter((p) => p.extra);
