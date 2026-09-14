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
    blurb: 'Swipe to match on group decisions: baby names, where to do your stag do, where to eat when you get there. On the web and the App Store. Designed and built by us.',
    link: 'https://getagreed.app',
    appStore: 'https://apps.apple.com/us/app/agreed-decide-together/id6789555845',
    tags: ['three.js', 'GSAP', 'Vite', 'Cloudflare', 'iOS'],
    deploy: 'Web + App Store',
    slug: 'agreed',
    story: 'Everyone swipes on their own phone and it finds the overlap. No arguing, no spreadsheet. Designed and built by us, from a sketch to a live web app and an App Store listing.',
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
    blurb: 'A gym planner that keeps lifting and running in one place. Writes the programme for you. In beta, launching soon.',
    link: 'https://doggins.app',
    tags: ['AI', 'Fitness'],
    extra: true,
    slug: 'doggins',
    story: 'Lifting and running in one plan, instead of 2 apps that ignore each other. It writes the programme, the tracker keeps you honest. In beta now, launching soon.',
  },
  {
    title: 'Yotpoint',
    year: '2024',
    blurb: 'Where superyacht crews find a vetted service provider by port and get a quote the same morning. Designed and built by us.',
    link: 'https://yotpoint.com',
    tags: ['Next.js', 'AWS Lambda', 'DynamoDB'],
    deploy: 'Live since 2024',
    slug: 'yotpoint',
    story: 'A crew member with a fault at 8am wants 4 electricians in La Ciotat by 9, not a directory to scroll. So it works by port and by problem: 250 companies across 129 ports, quotes back the same morning. Designed and built by us, and new features go live without breaking the ones captains already rely on.',
  },
  {
    title: 'Emotional Scripture',
    year: '2024',
    blurb: 'Pick how you feel and get scripture that meets you there, from 5 traditions. A small build, done properly.',
    link: 'https://emotionalscripture.pages.dev/',
    tags: ['Vue', 'Cloudflare Pages'],
    deploy: 'Live since 2024',
    slug: 'emotional-scripture',
    story: 'Turn the wheel to a feeling, read what 5 traditions have to say about it. Small brief, finished in weeks. Loads instantly, works on a phone, and costs nothing to keep online, so it will still be there next year without anyone thinking about it.',
  },
  {
    title: 'Latch Log',
    year: '2024',
    blurb: 'A feed and nappy tracker for new parents. Works with no signal at 3am, and shows the patterns once you have slept.',
    link: 'https://latchlog.pages.dev',
    tags: ['Vue', 'Convex', 'PWA'],
    extra: true,
  },
  {
    title: 'Villa La Mole',
    year: '2020',
    blurb: 'Direct bookings for a holiday home in the south of France, with a dashboard for the owner.',
    link: 'https://www.villalamole.com',
    tags: ['Vue', 'React', 'Convex'],
    deploy: 'Live since 2020',
    slug: 'villa-la-mole',
    story: 'A holiday home that wanted to take bookings directly. Guests check dates and book on the site, and the owner has a dashboard for the calendar, prices and enquiries. Live since 2020 and still taking bookings, which is the whole point.',
  },
];

export const featuredProjects = projects.filter((p) => !p.extra);
export const extraProjects = projects.filter((p) => p.extra);
