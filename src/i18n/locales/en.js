// English - the secondary locale. Same keys as ru.js.
export default {
  seo: {
    title: "copick - Full-Stack Web Developer",
    description: "Full-stack developer building websites, web apps, SaaS and AI products. From idea to launch.",
  },

  nav: {
    about: "About",
    projects: "Work",
    stack: "Stack",
    contact: "Contact",
    toTop: "Top",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    contactCta: "Get in touch",
  },

  hero: {
    status: "Open to projects",
    description: "I build web products end to end: interface, backend, database and AI. Three of them are already running in production.",
    ctaProjects: "See the work",
    scroll: "Scroll",
  },

  about: {
    eyebrow: "01 / About",
    heading: "About me",
    ageSuffix: "years old",
    ageSub: "",
    text: "I'm Artem, 16. I've been writing code for 2 years: I started with python and now build full-stack products with typescript, react, next.js and node.js. I come up with the idea, design the interface, write the backend and take it all the way to launch. ai is a tool that makes me faster, not one that does the work for me.",
    techWords: ["python", "typescript", "react", "next.js", "node.js", "ai", "backend"],
    markers: ["2 years of coding", "TypeScript · React · Next.js", "AI in my workflow and products", "From idea to launch"],
    phases: {
      start: { label: "Start", note: "first line of code" },
      python: { label: "Python", note: "algorithms, logic", sat: "Logic" },
      web: { label: "Web", note: "markup, browser", sat: "Frontend" },
      react: { label: "React / TypeScript", note: "components, types", sat: "Interfaces" },
      node: { label: "Next.js / Node.js", note: "server, API", sat: "Backend" },
      ai: { label: "AI", note: "models, integration", sat: "AI Layer" },
      fullstack: { label: "Full Stack", note: "end to end", sat: "Product" },
    },
  },

  ai: {
    eyebrow: "02 / AI at work",
    tag: "vibe coding",
    headingLine1: "AI speeds me up,",
    headingLine2: "it doesn't replace me",
    text: "Prototypes, exploring options, boilerplate, debugging: that's where AI saves me hours. The architecture and every line that ships to production, I understand myself.",
  },

  showcase: {
    eyebrow: "03 / What I build",
    headingLine1: "Bots. SaaS. Web.",
    headingLine2: "AI and automation.",
    sub: "Five directions, each backed by a real product. Keep scrolling and the phone shows how it works.",
    labels: {
      built: "What I do",
      stack: "Stack",
      step: "Screen",
      proof: "Example:",
    },
    chapters: {
      bots: {
        rail: "Bots",
        title: "Bots and mini apps",
        lead: "The bot greets people in the messenger and the mini app does the rest: catalog, generation, payments. Nobody has to leave the chat.",
        built: ["Bots for MAX and Telegram", "Mini apps inside the messenger", "Onboarding, bonuses, referrals", "Payments without leaving the chat"],
        cta: "Open ALTIME in MAX",
        steps: [
          "The real ALTIME bot messages: welcome, a bonus for subscribing, a button that launches the mini app.",
          "The mini app: 160+ photoshoots in 14 groups. The catalog is edited from the admin panel, no redeploy.",
          "Pick a photoshoot, upload a photo, and the final price is shown right away.",
          "Its own currency and packs. YooKassa payments right inside the messenger.",
        ],
      },
      saas: {
        rail: "SaaS",
        title: "SaaS products",
        lead: "A product with sign-up, a dashboard, data and pricing plans. QUANTIX runs invoices, prices and cash for small shops.",
        built: ["Landing page and SEO", "Sign-up and dashboard", "Data and roles", "Plans and billing", "AI inside the product"],
        cta: "Open QUANTIX",
        steps: [
          "The landing page: explains the product to a shop owner with no accountant and no Excel.",
          "Sign up and log in to the dashboard where invoices, prices and cash live.",
        ],
      },
      automation: {
        rail: "Automation",
        title: "Business automation",
        lead: "I connect services into chains that run without manual work: an event, a check, an API call, a database write, a result.",
        built: ["Webhooks and APIs", "Scheduled jobs", "No double processing", "Messenger notifications"],
        cta: "Talk about automation",
        steps: [
          "A real chain from ALTIME: a payment arrives by webhook, gets verified with the YooKassa API and lands on the balance.",
          "One run, step by step. A repeated webhook never credits twice, and a cron job re-checks stuck payments.",
        ],
      },
      web: {
        rail: "Web",
        title: "Web products",
        lead: "Complete web apps built for a specific job. ZFINDE finds businesses without a website by city and niche, using open data only.",
        built: ["OpenStreetMap collection", "Duplicate merging", "Lead scoring", "CSV export"],
        cta: "Open ZFINDE",
        steps: [
          "City, niche and how many leads you need. That's it.",
          "A real search: cafes in Stavropol. 146 found, 77 without a website. Phone numbers are blurred.",
        ],
      },
      ai: {
        rail: "AI",
        title: "AI integrations",
        lead: "I put models where they actually save time: image generation, document recognition, answers over your own data.",
        built: ["Image generation", "Document recognition", "Questions over your data", "Charge and refund on failure"],
        cta: "Try it in ALTIME",
        steps: [
          "ALTIME: your photo and the chosen photoshoot go to Gemini and the result comes back to the app. These shots are real.",
          "QUANTIX: the AI reads a photo of a paper invoice and fills in the supplier, items and totals. The data on screen is a sample.",
        ],
      },
    },
  },

  stack: {
    eyebrow: "04 / Technologies",
    heading: "Technologies",
    legendCore: "Core stack",
    legendTool: "Tooling",
    legendAi: "AI-accelerated",
    layers: {
      frontend: { title: "Frontend", note: "interface and interaction" },
      backend: { title: "Backend", note: "logic and API" },
      data: { title: "Data", note: "storage and access" },
      ai: { title: "AI", note: "models inside the product" },
    },
    core: { title: "Full Stack", note: "the whole product, from interface to database" },
  },

  bridges: {
    archToProduct: "architecture → product",
    allConnected: "every system connected",
  },

  projects: {
    eyebrow: "05 / Projects",
    heading: "Projects",
    personalBadge: "Personal project",
    quantix: {
      category: "SaaS",
      description:
        "My own product, from the first idea to a working service. Software for small shop owners: invoices, marked-up prices, cash tracking and an AI that reads paper documents.",
      facts: [
        { k: "Invoices", v: "markup and final prices are calculated as you type" },
        { k: "Invoice photo", v: "AI recognizes the supplier, items and totals" },
        { k: "Quantix AI", v: "ask about your purchases in plain language" },
        { k: "Cash book", v: "balance, income and spending without Excel" },
      ],
      cta: "Open QUANTIX",
    },
    altime: {
      category: "AI product in MAX",
      description:
        "AI photoshoots right inside a messenger. Concept, design, backend, payments and launch were all on me. The shots below were generated by the product itself.",
      stats: [
        { v: "160+", l: "photoshoots" },
        { v: "14", l: "groups" },
        { v: "🍓", l: "own currency" },
      ],
      cta: "Open in MAX",
    },
    zfinde: {
      category: "Tool",
      description:
        "Built for my own problem: finding businesses that need a website. It collects them from open sources, merges duplicates and keeps the ones with no site.",
      stats: [
        { v: "146", l: "found" },
        { v: "77", l: "no website" },
        { v: "28", l: "duplicates merged" },
      ],
      note: "Real query: cafes, Stavropol",
      cta: "Open ZFINDE",
    },
  },

  contact: {
    eyebrow: "06 / Contact",
    status: "Open to work",
    headingLine1: "Got an idea?",
    headingLine2: "Let's build it.",
    lead: "Open to work and new projects. Reach out however suits you.",
    primaryCta: "Get in touch",
  },

  footer: {
    copy: "© 2026 · Full-Stack Web Developer",
  },

  motion: {
    ariaLabel: "Motion settings",
    promptText: "Your system has animations turned off, so the site is shown statically. Turn on motion here?",
    enable: "Turn on",
    keep: "Keep it off",
    togglePrefix: "Motion:",
    toggleOn: "on",
    toggleOff: "off",
  },

  langSwitch: {
    ariaLabel: "Site language",
  },
};
