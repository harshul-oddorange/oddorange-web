/**
 * Site content.
 * Everything you are likely to change lives here: prices, packages, video links,
 * social links and email. Edit, save, redeploy. No other file needs touching.
 */

export const SITE = {
  name: 'Odd Orange',
  email: 'harshul@oddorange.co',
  // Booking page for the free 30-minute call ("Book a call" buttons).
  booking: 'https://calendly.com/oddorange/30min',
  // Harshul's own profile (linked from the founder card).
  founderLinkedin: 'https://www.linkedin.com/in/harshuljoshi/',
  // Leave a link empty ('') to show that icon greyed out with "soon".
  socials: {
    instagram: 'https://www.instagram.com/oddorange.co/',
    linkedin: 'https://www.linkedin.com/company/odd-orange/',
    x: 'https://x.com/Oddorangedotco',
    youtube: 'https://www.youtube.com/@oddorangedotco',
  },
};

/**
 * YouTube video IDs: the part after "v=" or after "/shorts/".
 * Leave an id empty ('') to show a "coming soon" slot.
 * Optional `poster`: your own still image in public/img/work (e.g. '/img/work/reel-01.webp').
 * Without one, a branded poster shows. Nothing loads from YouTube until a visitor presses play.
 */
export const VIDEOS = {
  showreel: {
    id: 'W4pvKKLiTCU',
    title: 'Odd Orange motion graphics showreel',
    poster: '/img/work/showreel.webp',
    // Silent loop that plays in the frame until the visitor presses play (self-hosted, not YouTube).
    preview: '/video/showreel-preview.mp4',
  },
  // "Fresh from the crate": every video on the YouTube channel except the showreel.
  // Posters are the channel's own YouTube thumbnails (marketing/thumbnails/final).
  work: [
    {
      id: 'AhxTuIf6da4',
      kind: 'motion',
      title: 'Wayfare',
      tag: 'Explainer breakdown',
      poster: '/img/work/wayfare.webp',
    },
    {
      id: 'yv7Jr585XhI',
      kind: 'motion',
      title: 'The window',
      tag: 'Brand film',
      poster: '/img/work/window.webp',
    },
    {
      id: 'v-0ec7srjPI',
      kind: 'reel',
      title: 'Now taking projects',
      tag: 'Promo Reel',
      poster: '/img/work/launch-reel.webp',
    },
    {
      id: 'rJuV32ZGj9o',
      kind: 'motion',
      title: 'Flowpilot',
      tag: 'SaaS launch film',
      poster: '/img/work/flowpilot.webp',
    },
    {
      id: '_5Nb3YsmLIg',
      kind: 'motion',
      title: 'Kova 2.0',
      tag: 'SaaS launch film',
      poster: '/img/work/kova.webp',
    },
    {
      id: 'RDAsEcR5mac',
      kind: 'reel',
      title: 'Brand identity',
      tag: 'Motion Reel',
      poster: '/img/work/identity.webp',
    },
    {
      id: '6dBQlNGDdZk',
      kind: 'motion',
      title: 'Odd Orange era',
      tag: 'Studio promo',
      poster: '/img/work/era.webp',
    },
    {
      id: '2phRXIjkVaY',
      kind: 'motion',
      title: 'Our first showreel',
      tag: 'Showreel 2026',
      poster: '/img/work/showreel-2026.webp',
    },
    {
      id: 'V6yMUhntFyg',
      kind: 'motion',
      title: 'Logo animation A',
      tag: 'Logo sting',
      poster: '/img/work/sting-a.webp',
    },
    {
      id: 'aupWhf1hqyU',
      kind: 'motion',
      title: 'Logo animation B',
      tag: 'Logo sting',
      poster: '/img/work/sting-b.webp',
    },
  ],
};

/**
 * Testimonials. The section stays hidden until this list has at least one entry.
 * Only add real quotes, word for word, from clients who said yes to being quoted.
 * `photo` is optional (a square image in public/img); `link` is optional (their site or post).
 * Example:
 *   { quote: 'Exact words from the client.', name: 'Client name', role: 'Founder',
 *     company: 'Company', photo: '', link: '' },
 */
export const TESTIMONIALS = [];

/**
 * Pricing, packages and process, one entry per service category.
 * `meters` score each package from 1 to 3 so visitors can see at a glance
 * how Premium differs from Standard. `sample` is the YouTube id and poster of a
 * short example of that package (leave `id` empty until you have one).
 * Every price needs both `inr` and `usd`: the ₹ / $ switch changes the whole pricing section.
 * A price can be a [low, high] range; a package without `meters` hides the comparison dots.
 */
export const SERVICES = [
  {
    key: 'reels',
    number: '01',
    title: 'Reels & Video Editing',
    short: 'Reels editing',
    accent: 'orange',
    summary:
      'Reels, Shorts and social videos edited from your footage: pacing, captions, music, colour and motion.',
    uses: ['New arrivals', 'Product showcases', 'Fashion campaigns', 'Promos'],
    // Real work tucked into the "What we make" card, back to front.
    stills: ['/img/work/identity.webp', '/img/work/launch-reel.webp'],
    note: 'Priced per Reel by how much the edit needs, for Reels up to 60 seconds edited from footage you supply. You get the exact price before we start.',
    sampleKind: 'reel',
    meterLabels: ['Editing', 'Motion graphics', 'Creative treatment'],
    packages: [
      {
        // One package priced as a range: where a Reel lands depends on how much the edit needs.
        tier: 'Reel editing',
        key: 'reel',
        price: { inr: [2000, 5000], usd: [20, 50] },
        per: 'per Reel',
        revisions: '2 revision rounds',
        promise: 'From a clean, quick edit to a Reel built to stop the scroll.',
        includes: [
          'Clean cuts, pacing and beat sync',
          'Captions and animated typography',
          'Colour correction, and grading where footage allows',
          'Transitions, simple motion graphics and effects',
          'Sound design where appropriate',
          'Two revision rounds',
        ],
        bestFor: 'Boutiques, product showcases, new arrivals, fashion campaigns and brand ads.',
        sample: {
          id: 'v-0ec7srjPI',
          title: 'Odd Orange · now taking projects',
          poster: '/img/work/launch-reel.webp',
        },
      },
    ],
    custom:
      'Longer videos, complex edits, unusable footage, filming, extensive motion graphics and extra deliverables get a custom quote.',
    payment: [
      { pct: 50, label: 'Upfront to begin work' },
      { pct: 50, label: 'After the edit is complete, before the final unwatermarked file' },
    ],
    steps: [
      ['Review', 'We review your footage and brief.'],
      ['Plan', 'We prepare an editing plan or storyboard when it helps.'],
      ['Approve', 'You approve the plan before we start the agreed edit.'],
      ['Edit', 'We complete the edit and share a review version.'],
      ['Deliver', 'We make the included revisions and deliver the final file after payment.'],
    ],
  },
  {
    key: 'motion',
    number: '02',
    title: 'Motion Graphics & SaaS Explainers',
    short: 'Motion graphics',
    accent: 'leaf',
    summary: 'Animated explainers, product launches and UI animation that make software easy to understand.',
    uses: ['SaaS explainers', 'Product launches', 'UI animation', 'Feature videos'],
    stills: ['/img/work/flowpilot.webp', '/img/work/wayfare.webp'],
    note: 'Starting prices for videos up to 60 seconds.',
    sampleKind: 'motion',
    meterLabels: ['Animation detail', 'UI & product animation', 'Visual effects'],
    packages: [
      {
        tier: 'Standard',
        price: { inr: 20000, usd: 200 },
        per: 'per video',
        revisions: '1 revision round per stage',
        promise: 'Simple, focused motion graphics.',
        meters: [2, 1, 1],
        includes: [
          'Basic 2D animation',
          'Simple shapes and transitions',
          'Basic kinetic typography',
          'Simple software UI animation using supplied assets',
          'Basic sound design where appropriate',
          'One revision round at each agreed stage',
        ],
        bestFor: 'Feature announcements, simple product explainers and social clips.',
        sample: { id: '6dBQlNGDdZk', title: 'Odd Orange era', poster: '/img/work/era.webp' },
      },
      {
        tier: 'Premium',
        price: { inr: 40000, usd: 400 },
        per: 'per video',
        revisions: '2 revision rounds per stage',
        promise: 'Richer product storytelling and animation.',
        meters: [3, 3, 3],
        includes: [
          'More detailed 2D motion graphics',
          'More sophisticated typography and transitions',
          'Detailed UI and product animations',
          'Layered compositions and visual effects',
          'Sound design',
          'Two revision rounds at each agreed stage',
        ],
        bestFor: 'Product launches, landing-page explainers and investor-ready demos.',
        sample: { id: 'AhxTuIf6da4', title: 'Wayfare explainer breakdown', poster: '/img/work/wayfare.webp' },
      },
    ],
    custom:
      'Final scope depends on the brief. Custom illustration, extensive scripting, complex compositing and significant extra production are not automatically included.',
    payment: [
      { pct: 50, label: 'Upfront before work begins' },
      { pct: 50, label: 'After you approve the visual designs, before animation starts' },
    ],
    steps: [
      [
        'Brief & script',
        'We understand the product, audience, goal and message, and confirm whether you supply the script or need scriptwriting.',
      ],
      [
        'Sketch storyboard',
        'A rough scene-by-scene storyboard showing how the video tells the story. Sent for your approval.',
      ],
      ['Visual design', 'We design the assets and style frames. You approve the look before any animation.'],
      [
        'Motion graphics',
        'We animate the approved designs, add the agreed sound design and share a review version.',
      ],
      [
        'Revisions & delivery',
        'We complete the included revisions and deliver the final video to the agreed scope.',
      ],
    ],
    changeNote: 'Changes to an approved storyboard or design are quoted separately.',
  },
];

export const PRICING_NOTES = {
  taxes: 'Prices exclude taxes; any applicable tax is shown on your quote and invoice.',
  notIncluded:
    'Scripting, filming, voice-over, extensive illustration and 3D animation are not included unless agreed separately.',
  revisions: 'No unlimited revisions: every package lists exactly how many rounds are included.',
};
