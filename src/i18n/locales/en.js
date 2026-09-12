// English — secondary language. Adapted for meaning and tone, not
// translated word-for-word. Brand names, tech names and product names are
// kept exactly as in the Russian version.
export default {
  seo: {
    title: "copick — Full-Stack Web Developer",
    description: "Full-Stack Web Developer creating modern websites, web applications, SaaS and AI-powered digital products.",
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
    description: "I build modern websites, web apps, and digital products — from idea to finished product.",
    ctaProjects: "View projects",
    scroll: "Scroll",
  },

  about: {
    eyebrow: "01 / About",
    heading: "About me",
    ageSuffix: "years old",
    ageSub: "senior year, high school",
    text: "My name is Artem — I'm 16, in my final year of school. I've been programming since 14: I started with Python, and now I work as a full-stack developer, building modern web products (and more) with a focus on quality, performance, and usability. I use TypeScript, React, Next.js, and Node.js, treat AI as a tool that speeds up development, and build complete products end-to-end — from idea and interface to backend logic and the database.",
    techWords: ["python", "typescript", "react", "next.js", "node.js", "ai", "backend"],
    markers: ["Coding since 14", "TypeScript · React · Next.js", "AI-assisted development", "End-to-end delivery"],
    phases: {
      start: { label: "Age 14", note: "first line of code" },
      python: { label: "Python", note: "algorithms, logic", sat: "Logic" },
      web: { label: "Web", note: "markup, browser", sat: "Frontend" },
      react: { label: "React / TypeScript", note: "components, types", sat: "Interfaces" },
      node: { label: "Next.js / Node.js", note: "server, API", sat: "Backend" },
      ai: { label: "AI", note: "models, integration", sat: "AI Layer" },
      fullstack: { label: "Full Stack", note: "end to end", sat: "Product" },
    },
  },

  ai: {
    eyebrow: "02 / AI-Assisted Dev",
    tag: "vibe coding",
    headingLine1: "AI speeds up",
    headingLine2: "development",
    text: "I use AI not instead of development, but as an accelerator: for prototyping, exploring solutions, generating boilerplate, debugging, and iterating on the product. I understand every line myself — AI speeds things up, it doesn't replace the work.",
  },

  whatIdo: {
    eyebrow: "03 / What I Do",
    heading: "What I Do",
    services: {
      websites: {
        name: "Websites",
        description: "Fast, modern websites with thoughtful animation and attention to detail — built with React and Next.js.",
        deco: ["Open for dinner", "Reservation · 19:30"],
      },
      webapps: {
        name: "Web Applications",
        description: "Full-featured web applications — from the interface to the API and business logic in Node.js.",
        deco: ["Live data", "Updated · 2s"],
      },
      saas: {
        name: "SaaS Products",
        description: "Turnkey SaaS products: authentication, databases (PostgreSQL, Prisma), third-party integrations.",
        deco: ["MRR is growing", "Synced"],
      },
      ai: {
        name: "AI Integrations",
        description: "Embedding AI models (Replicate and compatible APIs) into the product — from image processing to content generation.",
        deco: ["Model: SDXL", "Generating · 4s"],
      },
      interactive: {
        name: "Interactive Interfaces",
        description: "Interfaces built with Framer Motion and Three.js that don't just work — they feel like a finished product.",
        deco: ["60 fps", "Cursor active"],
      },
    },
    screens: {
      restaurant: {
        menu: "Menu",
        book: "Book",
        heroTag: "Open flame",
        headlineLine1: "A dinner",
        headlineLine2: "worth remembering",
        sub1: "Seasonal menu. Open flame. Evening atmosphere.",
        cta: "Reserve a table",
        sub2: "Cooked over live fire: wood oven, charcoal, seasonal produce from local farms.",
        dishes: [
          { name: "Tuna tartare", price: "890 ₽" },
          { name: "Ribeye steak", price: "2,400 ₽" },
          { name: "Charred octopus", price: "1,650 ₽" },
          { name: "Pistachio baklava", price: "640 ₽" },
        ],
        hours: [
          { days: "Mon – Thu", time: "18:00 — 00:00" },
          { days: "Fri – Sun", time: "17:00 — 02:00" },
        ],
        info: "Patriarshiye · Daily 18:00–00:00",
        reserve: "Today · 19:30 · 2 guests",
        footLine: "Bolshaya Bronnaya, 12",
      },
      webapp: {
        headline: "Real-time overview",
        active: "Active",
        activeValue: "1,204",
        latency: "Latency",
        feed: ["Ivan paid invoice #2291", "New user signed up", "Deploy finished · main"],
        footer: "Synced 2s ago",
      },
      saas: {
        revenueLabel: "Monthly revenue",
        revenueValue: "₽482,000",
        orders: "Orders",
        products: "Products",
        list: [
          { label: "Invoice #1042", status: "paid", ok: true },
          { label: "Invoice #1041", status: "pending", ok: false },
          { label: "Air Sneakers", status: "12 pcs", ok: false },
        ],
        footer: "Updated just now",
      },
      ai: {
        userMsg1: "sunset over mountains, cinematic",
        botText: "Done — four options:",
        userMsg2: "make it warmer",
        inputPlaceholder: "Message…",
      },
      ready: {
        status: "Complete",
        titleLine1: "Five products —",
        titleLine2: "one approach",
        items: [
          { name: "EMBER", kind: "website" },
          { name: "Pulse", kind: "web app" },
          { name: "Quantix", kind: "SaaS" },
          { name: "Nova", kind: "AI" },
          { name: "Depth", kind: "interface" },
        ],
        footer: "From mockup to production",
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
    core: { title: "Full Stack", note: "the whole product — from interface to database" },
  },

  bridges: {
    archToProduct: "architecture → product",
    allConnected: "all systems connected",
  },

  projects: {
    eyebrow: "05 / Projects",
    heading: "Selected projects",
    personalBadge: "Personal project",
    demoSoon: "Demo soon",
    quantix: {
      category: "SaaS product",
      featuredLabel: "Flagship project",
      description:
        "A product I conceived and built myself, end to end — from idea and interface to backend logic and the database. An AI SaaS platform for inventory and invoice management: it recognizes documents with AI, extracts the data, and helps run warehouse operations.",
      cta: "Open QUANTIX",
    },
    altme: {
      category: "AI bot for MAX",
      description:
        "My own AI product — concept, development, and launch all mine. An AI bot and mini-app inside the MAX messenger for generating and restyling photos. Upload a photo, pick an AI style or write your own prompt, an in-app currency 🍓, and a referral system — the whole experience lives inside MAX, with no separate website.",
      cta: "Open in MAX",
    },
    zfinde: {
      category: "Web product",
      description:
        "A tool I built for my own need, from concept to finish. «Lidoiskatel» (“Lead Finder”) looks for businesses without a website by city and niche — pulling them from open sources, no paid APIs, and surfacing phone numbers to call.",
      cta: "Open ZFINDE",
    },
  },

  contact: {
    eyebrow: "06 / Contact",
    status: "Open to connect",
    headingLine1: "Reach out about",
    headingLine2: "working together.",
    lead: "Open to new projects and collaborations — reach out however works best for you.",
    primaryCta: "Message me",
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
