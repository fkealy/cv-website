// Shared project list. `extra: true` keeps a project off the front page and
// puts it on /extra instead — the hobby builds that aren't finished.
export interface Project {
  title: string;
  year: string;
  blurb: string;
  link?: string;
  tags: string[];
  extra?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Agreed',
    year: '2026',
    blurb: 'Swipe to match on group decisions: baby names, where to do your stag do, the best place to eat when you get there. Everyone swipes and it surfaces what you all agree on.',
    link: 'https://getagreed.app',
    tags: ['three.js', 'GSAP', 'Vite', 'Cloudflare'],
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
  },
  {
    title: 'Yotpoint',
    year: '2024',
    blurb: 'A marketplace connecting superyacht crews with vetted service providers. Co-founding it now.',
    link: 'https://yotpoint.com',
    tags: ['Next.js', 'AWS Lambda', 'DynamoDB'],
  },
  {
    title: 'Emotional Scripture',
    year: '2024',
    blurb: 'A small web app that maps emotions to scripture across religions.',
    link: 'https://emotionalscripture.pages.dev/',
    tags: ['Vue', 'Cloudflare Pages'],
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
  },
];

export const featuredProjects = projects.filter((p) => !p.extra);
export const extraProjects = projects.filter((p) => p.extra);
