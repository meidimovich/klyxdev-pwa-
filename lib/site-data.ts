export type ProjectCategory = "PWA" | "Web Apps" | "Sites" | "E-commerce" | "AI";
export type ProjectLocaleContent = {
  title?: string;
  short?: string;
  description?: string;
  details?: string[];
  tech?: string[];
};

export type SiteProject = {
  slug: string;
  name: string;
  category: ProjectCategory | string;
  short: string;
  description: string;
  tags: string[];
  details: string[];
  image: string;
  cover: string;
  published: boolean;
  metrics: {
    label: string;
    value: string;
  }[];
  tech: string[];
  content?: {
    ru?: ProjectLocaleContent;
    en?: ProjectLocaleContent;
  };
};

export type ServiceItem = {
  title: string;
  description: string;
  features: string[];
};

export const projectCategories = ["All", "PWA", "Web Apps", "Sites", "E-commerce", "AI"] as const;

export const defaultProjects: SiteProject[] = [
  {
    slug: "nova-market",
    name: "Nova Market",
    category: "PWA",
    short: "A premium marketplace PWA with native-like UX for mobile shoppers.",
    description:
      "We built a mobile-first commerce platform with smart product discovery, saved carts, and seamless checkout flows.",
    tags: ["Marketplace", "PWA", "Commerce"],
    details: [
      "Designed a premium storefront with segment-based browsing and purchase flows.",
      "Implemented progressive web app features for installability and offline browsing.",
      "Connected payments and inventory automation for real-time operations.",
    ],
    image: "",
    cover: "",
    published: true,
    metrics: [
      { label: "Conversion uplift", value: "+28%" },
      { label: "Time to checkout", value: "1.4x" },
      { label: "Install rate", value: "62%" },
    ],
    tech: ["Next.js", "PWA", "Stripe", "Supabase"],
  },
  {
    slug: "atlas-dashboard",
    name: "Atlas Dashboard",
    category: "Web Apps",
    short: "Internal operations platform for service teams and analytics.",
    description:
      "A custom SaaS dashboard helping operational teams manage work, budgets, and client data from one interface.",
    tags: ["SaaS", "Dashboard", "Automation"],
    details: [
      "Unified multiple business processes into a single operational workspace.",
      "Created advanced filters, role access, and realtime reporting for the ops team.",
      "Streamlined recurring tasks and reduced manual coordination by 40%.",
    ],
    image: "",
    cover: "",
    published: true,
    metrics: [
      { label: "Ops time saved", value: "40%" },
      { label: "Active users", value: "1.2k" },
      { label: "Faster reporting", value: "3x" },
    ],
    tech: ["React", "Node.js", "PostgreSQL", "Charts"],
  },
  {
    slug: "mira-campaign",
    name: "Mira Campaign",
    category: "Sites",
    short: "High-conversion campaign website for a growth-led product launch.",
    description:
      "Built a marketing microsite with storytelling, lead capture, and performance-focused conversion blocks.",
    tags: ["Marketing", "Campaign", "Brand"],
    details: [
      "Crafted a conversion-first story arc tailored to the product positioning.",
      "Integrated lead generation form and CRM handoff flows.",
      "Delivered a clean landing experience optimized for mobile acquisition traffic.",
    ],
    image: "",
    cover: "",
    published: true,
    metrics: [
      { label: "CTR lift", value: "+17%" },
      { label: "Leads generated", value: "480" },
      { label: "Mobile score", value: "98/100" },
    ],
    tech: ["Next.js", "Tailwind", "SEO", "Analytics"],
  },
  {
    slug: "luma-store",
    name: "Luma Store",
    category: "E-commerce",
    short: "Premium ecommerce storefront for a lifestyle brand with multiple product flows.",
    description:
      "An online store infrastructure built for brand storytelling, stable product discovery, and efficient merchandising.",
    tags: ["E-commerce", "Shopify", "Brand"],
    details: [
      "Built custom storefront sections, category navigation, and collections.",
      "Optimized mobile buying experience and frictionless checkout UX.",
      "Introduced automation for order updates, inventory signals, and campaign content.",
    ],
    image: "",
    cover: "",
    published: true,
    metrics: [
      { label: "Average order value", value: "+22%" },
      { label: "Return visitors", value: "44%" },
      { label: "Load speed", value: "1.8s" },
    ],
    tech: ["Shopify", "Hydrogen", "Tailwind", "Payments"],
  },
  {
    slug: "cobalt-ai",
    name: "Cobalt AI",
    category: "AI",
    short: "An AI-assisted business assistant with workflow automation and recommendations.",
    description:
      "We designed and launched a decision-support product that combines document analysis, summarization, and structured automation.",
    tags: ["AI", "Automation", "Workflow"],
    details: [
      "Created a conversational interface for operational queries and internal recommendations.",
      "Integrated document parsing and summarization into daily workflow automation.",
      "Enabled a better onboarding and training loop through guided AI prompts and actions.",
    ],
    image: "",
    cover: "",
    published: true,
    metrics: [
      { label: "Workflow saving", value: "53%" },
      { label: "Tasks automated", value: "92" },
      { label: "Decision speed", value: "5x" },
    ],
    tech: ["OpenAI", "Next.js", "RAG", "Automation"],
  },
];

export const services: ServiceItem[] = [
  {
    title: "Websites",
    description: "Premium business websites built to look credible and convert attention into action.",
    features: ["Brand positioning", "Landing pages", "CMS", "SEO"],
  },
  {
    title: "PWA apps",
    description: "Installable product experiences that feel native on mobile and desktop devices.",
    features: ["Offline support", "App install", "Native UX", "Push flows"],
  },
  {
    title: "Telegram WebApps",
    description: "Turn business workflows into Telegram-first experiences for users and teams.",
    features: ["Bot integration", "User flows", "Lightweight UI", "Automation"],
  },
  {
    title: "E-commerce",
    description: "Storefronts and digital commerce journeys built around trust, clarity, and speed.",
    features: ["Catalog UX", "Checkout", "Inventory", "CRM"],
  },
  {
    title: "Integrations",
    description: "Connect the tools your business already relies on and remove operational friction.",
    features: ["APIs", "Automation", "Reporting", "CRM sync"],
  },
  {
    title: "AI solutions",
    description: "Smart internal products that reduce repetitive work and give teams better decisions.",
    features: ["AI assistants", "Summaries", "Automation", "Analytics"],
  },
];

export const teamMembers = [
  { name: "Product Strategy", role: "Research & vision" },
  { name: "Design System", role: "UX & product design" },
  { name: "Frontend Engineering", role: "Interfaces & experiences" },
  { name: "Backend Engineering", role: "Data & automation" },
];

export const processSteps = [
  "Discovery and framing",
  "Product design and systems",
  "Development and testing",
  "Launch and iteration",
];

export const siteSettings = {
  brand: "KLYXDEV",
  email: "hello@klyxdev.dev",
  telegram: "@klyxdev",
  phone: "+1 (415) 555-0147",
  availability: "Open for new projects",
};
