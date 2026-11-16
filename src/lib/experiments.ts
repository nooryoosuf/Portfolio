import { supabase } from "@/lib/supabase";
import type { GitHubRepoMetadata } from "@/lib/github";

export const EXPERIMENT_CATEGORIES = [
    "Product Experiments",
    "Web Projects",
    "Tools & Automation",
    "Creative Experiments",
    "Ideas & Concepts",
] as const;

export type ExperimentCategory = (typeof EXPERIMENT_CATEGORIES)[number] | string;

export const EXPERIMENT_STATUSES = [
    "In Progress",
    "Live",
    "Experimental",
    "Archived",
] as const;

export type ExperimentStatus = (typeof EXPERIMENT_STATUSES)[number] | string;

export const STORY_SECTION_PRESETS = [
    {
        key: "the_idea",
        title: "The Idea",
        prompt: "What inspired the project? What problem was I trying to solve? What made me want to build it?",
    },
    {
        key: "the_experiment",
        title: "The Experiment",
        // eslint-disable-next-line max-len
        prompt: "What was the original concept? What did I want to explore or test?",
    },
    {
        key: "the_process",
        title: "The Process",
        prompt: "Document the development journey, design decisions, tools, technologies, and iterations.",
    },
    {
        key: "interesting_bits",
        title: "The Interesting Bits",
        prompt: "Highlight unique features, technical implementations, unusual ideas, or particularly interesting product decisions.",
    },
    {
        key: "challenges",
        title: "Challenges & Decisions",
        prompt: "Explain what was difficult, what changed during development, and why certain decisions were made.",
    },
    {
        key: "the_outcome",
        title: "The Outcome",
        prompt: "Show what was actually built. Include screenshots, live previews, or demonstrations where available.",
    },
    {
        key: "things_learned",
        title: "Things I Learned",
        prompt: "Personal reflections, lessons, things that worked, and things I would approach differently.",
    },
] as const;

export interface ExperimentGalleryItem {
    url: string;
    caption?: string;
    layout?: "full" | "split" | "desktop" | "mobile";
}

export interface ExperimentContentBlock {
    type: "section" | "image_grid" | "quote" | "list" | "video" | "compare" | "embed";
    section_key?: string;
    title?: string;
    content?: string;
    caption?: string;
    author?: string;
    columns?: 1 | 2 | 3;
    images?: string[];
    captions?: string[];
    frame?: "raw" | "desktop" | "mobile";
    items?: string[];
    url?: string;
    before?: string;
    after?: string;
    beforeLabel?: string;
    afterLabel?: string;
}

export const GRADIENT_PRESETS = [
    {
        id: "crimson-dusk",
        label: "Crimson Dusk",
        primary: "#E3256B",
        secondary: "#7C3AED",
        tertiary: "#FF6B4A",
    },
    {
        id: "razzmatazz-glow",
        label: "Razzmatazz Glow",
        primary: "#F7095E",
        secondary: "#FB7185",
        tertiary: "#F59E0B",
    },
    {
        id: "ember-coral",
        label: "Ember Coral",
        primary: "#E11D48",
        secondary: "#EA580C",
        tertiary: "#FBBF24",
    },
    {
        id: "indigo-nebula",
        label: "Indigo Nebula",
        primary: "#6366F1",
        secondary: "#A855F7",
        tertiary: "#38BDF8",
    },
    {
        id: "oceanic-atoll",
        label: "Oceanic Atoll",
        primary: "#0EA5E9",
        secondary: "#14B8A6",
        tertiary: "#6366F1",
    },
    {
        id: "emerald-aurora",
        label: "Emerald Aurora",
        primary: "#10B981",
        secondary: "#06B6D4",
        tertiary: "#84CC16",
    },
    {
        id: "amber-horizon",
        label: "Amber Horizon",
        primary: "#F59E0B",
        secondary: "#EF4444",
        tertiary: "#EC4899",
    },
] as const;

export type GradientPresetId = (typeof GRADIENT_PRESETS)[number]["id"] | string;

export interface ExperimentProject {
    id: string;
    title: string;
    slug: string;
    short_description: string;
    full_story?: string;
    cover_image?: string;
    cover_mode?: "ascii" | "gradient" | "image";
    gradient_preset?: GradientPresetId;
    ascii_pattern?: "wave" | "vortex" | "topography" | "matrix" | "pulse";
    gallery?: ExperimentGalleryItem[];
    category: ExperimentCategory;
    status: ExperimentStatus;
    technologies: string[];
    year?: string;
    color?: string;
    featured: boolean;
    published: boolean;
    live_url?: string;
    github_url?: string;
    github_metadata?: Partial<GitHubRepoMetadata> | null;
    content_blocks: ExperimentContentBlock[];
    created_at: string;
    updated_at: string;
}

export interface TinkeringItem {
    id: string;
    title: string;
    note: string;
    category: string;
    status: ExperimentStatus;
    technologies?: string[];
    github_url?: string;
    live_url?: string;
}

const LOCAL_EXPERIMENTS_KEY = "portfolio_experiments_v2";
const LOCAL_TINKERING_KEY = "portfolio_tinkering_v2";

export const INITIAL_EXPERIMENTS: ExperimentProject[] = [
    {
        id: "exp-euphex",
        title: "Euphex",
        slug: "euphex",
        short_description:
            "The official digital home for Euphex Esports — a competitive Mobile Legends: Bang Bang organization fielding two squads (Euphex & Aurex), complete with rosters, match tracking, scrim requests, and interactive community mini-games.",
        full_story:
            "Built and shipped at euphex.mv — combining a custom esports brand system (#E3256B accent, Euphex & Aurex marks, and custom lane iconography) with team & player profiles, tournament records, scrim/recruitment workflows, and playable MLBB community tools.",
        cover_image: "",
        gallery: [],
        category: "Web Projects",
        status: "Live",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase", "Cloudflare Pages"],
        year: "2026",
        color: "#E3256B",
        featured: true,
        published: true,
        live_url: "https://euphex.mv",
        github_url: "https://github.com/nooryoosuf/euphex",
        github_metadata: {
            name: "euphex",
            full_name: "nooryoosuf/euphex",
            html_url: "https://github.com/nooryoosuf/euphex",
            description:
                "Euphex is a competitive Mobile Legends: Bang Bang esports organization fielding two squads under one standard — Euphex and Aurex.",
            language: "TypeScript",
            stargazers_count: 0,
            pushed_at: "2026-10-28T06:05:30Z",
            visibility: "public",
            homepage: "https://euphex.mv",
        },
        content_blocks: [
            {
                type: "section",
                section_key: "the_idea",
                title: "The Idea",
                content:
                    "Esports organizations in the Maldives put serious hours into scrims, drafts, and tournaments, yet their online presence usually lives scattered across Instagram posts and TikTok clips. Euphex was built to give the organization a permanent, high-craft home at euphex.mv — uniting both competitive squads, Euphex and Aurex, under one roof.",
            },
            {
                type: "embed",
                url: "https://euphex.mv",
                title: "euphex.mv — Euphex Esports Live Site",
                caption: "Live production deployment on euphex.mv — load the interactive preview above or open in a new tab.",
            },
            {
                type: "section",
                section_key: "the_experiment",
                title: "The Experiment",
                content:
                    "I wanted the site to feel like more than a static brochure. Alongside competitive modules — Teams, Players, Matches, Tournaments, News, Scrim Requests, and Recruitment — we experimented with interactive community features built directly into the site.",
            },
            {
                type: "section",
                section_key: "interesting_bits",
                title: "The Interesting Bits",
                content:
                    "Beyond roster profiles and custom MLBB lane SVG iconography, the site ships three playable community experiences — a Retribution timing reflex test (/retri-test), a 'Who's That Hero' guessing game (/whos-that-hero) backed by an automated hero-roster ingest pipeline, and 'Roast the Roster' (/roast) — plus a timezone-aware LaunchGate and instant Scrim & Recruitment application flows.",
            },
            {
                type: "section",
                section_key: "the_outcome",
                title: "The Outcome",
                content:
                    "Deployed live at euphex.mv via Cloudflare Pages as a fast Next.js static export paired with Supabase content and analytics.",
            },
        ],
        created_at: "2026-10-28T06:05:30Z",
        updated_at: "2026-10-28T06:05:33Z",
    },
    {
        id: "exp-pebble",
        title: "Pebble",
        slug: "pebble",
        short_description:
            "A gamified daily learning platform exploring interactive Business Studies education, student profiles, progress tracking, and parent dashboards.",
        full_story:
            "An installable daily-learning web app built around Grade 7 Business Studies curriculum content — pairing bite-sized student lessons, XP milestones, and offline-capable PWA sync with a dedicated parent reporting dashboard.",
        cover_image: "",
        gallery: [],
        category: "Product Experiments",
        status: "Live",
        technologies: ["React", "TypeScript", "Vite", "Supabase", "PWA"],
        year: "2026",
        color: "#F7095E",
        featured: true,
        published: true,
        live_url: "https://pebble.nooryoosuf.com",
        github_url: "https://github.com/nooryoosuf/pebble",
        github_metadata: {
            name: "pebble",
            full_name: "nooryoosuf/pebble",
            html_url: "https://github.com/nooryoosuf/pebble",
            description: "Pebble: a playful daily Business Studies learning platform for Grade 7",
            language: "TypeScript",
            stargazers_count: 0,
            pushed_at: "2026-10-15T06:28:13Z",
            visibility: "public",
        },
        content_blocks: [
            {
                type: "section",
                section_key: "the_idea",
                title: "The Idea",
                content:
                    "Textbook revision often feels like a chore for students and a black box for parents. Pebble started with a simple question: what if studying Grade 7 Business Studies felt closer to a daily habit loop — short, interactive, and visibly rewarding — while giving parents a clear window into how their child is actually progressing?",
            },
            {
                type: "section",
                section_key: "the_experiment",
                title: "The Experiment",
                content:
                    "I wanted to test how curriculum notes and multiple-choice question banks could be structured into a playful daily learning flow with separate student and parent perspectives.\n\nEach family has its own account in Supabase, where parents can create child profiles, set goals, and review real attempt histories — strictly isolated per family via Row-Level Security.",
            },
            {
                type: "section",
                section_key: "interesting_bits",
                title: "The Interesting Bits",
                content:
                    "Pebble ships as an installable Progressive Web App (PWA) with a service worker so the app shell, illustrations, and fonts keep working offline, syncing lesson progress once the device reconnects.\n\nIt also deliberately avoids silent fake fallbacks: if backend credentials aren't connected locally, it surfaces an explicit state rather than pretending data was saved.",
            },
            {
                type: "section",
                section_key: "things_learned",
                title: "Things I Learned",
                content:
                    "Designing for two very different audiences in the same product — a 12-year-old student who wants momentum and encouragement, and a parent who wants clarity and honest reporting — forced every screen to stay focused on one job at a time.",
            },
        ],
        created_at: "2026-10-15T06:28:13Z",
        updated_at: "2026-10-15T06:28:17Z",
    },
    {
        id: "exp-chonky",
        title: "Chonky",
        slug: "chonky",
        short_description:
            "A single-restaurant food delivery platform exploring ordering, delivery tracking, loyalty systems, and restaurant-owned digital experiences.",
        full_story:
            "An exploration into what happens when a food brand owns its entire ordering, cart, delivery map, and loyalty experience instead of disappearing inside a third-party aggregator.",
        cover_image: "",
        gallery: [],
        category: "Product Experiments",
        status: "In Progress",
        technologies: ["React", "TypeScript", "Tailwind CSS", "MapLibre GL", "Vite"],
        year: "2026",
        color: "#E11D48",
        featured: true,
        published: true,
        live_url: "",
        github_url: "https://github.com/nooryoosuf/chonky",
        github_metadata: {
            name: "chonky",
            full_name: "nooryoosuf/chonky",
            html_url: "https://github.com/nooryoosuf/chonky",
            description: "Single-restaurant food ordering, delivery tracking, and loyalty platform",
            language: "TypeScript",
            stargazers_count: 0,
            pushed_at: "2026-11-04T05:53:58Z",
            visibility: "public",
        },
        content_blocks: [
            {
                type: "section",
                section_key: "the_idea",
                title: "The Idea",
                content:
                    "Most local restaurants either rely on generic delivery apps that strip away their brand personality or settle for a static PDF menu. Chonky was conceived to explore a direct-to-customer restaurant platform where bold brand identity and fast mobile ordering work together.",
            },
            {
                type: "section",
                section_key: "the_experiment",
                title: "The Experiment",
                content:
                    "Built around a custom brand system (Chonky Icon & Typography, Satoshi and Plus Jakarta Sans pairing), this experiment explores menu customization for burgers, subs, and pizzas, smooth mobile-first checkout, loyalty rewards, and map-based delivery location pinning with MapLibre GL.",
            },
            {
                type: "section",
                section_key: "the_process",
                title: "The Process",
                content:
                    "Designed mobile-first with viewport-fit handling and tactile micro-interactions, focusing on reducing the number of taps between craving something on the menu and confirming a delivery drop-off pin.",
            },
        ],
        created_at: "2026-11-04T05:53:58Z",
        updated_at: "2026-11-04T05:54:02Z",
    },
    {
        id: "exp-mlbb-codex",
        title: "MLBB Codex",
        slug: "mlbb-codex",
        short_description:
            "A Mobile Legends encyclopedia exploring hero information, lore, stories, community features, and an interactive gaming knowledge archive.",
        full_story:
            "A statically generated Mobile Legends: Bang Bang companion combining a comprehensive Hero Codex, item & emblem reference, patch highlights, live ranked meta boards, and interactive drafting tools.",
        cover_image: "",
        gallery: [],
        category: "Web Projects",
        status: "Experimental",
        technologies: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"],
        year: "2026",
        color: "#6366F1",
        featured: true,
        published: true,
        live_url: "",
        github_url: "https://github.com/nooryoosuf/mlbb-codex",
        github_metadata: {
            name: "mlbb-codex",
            full_name: "nooryoosuf/mlbb-codex",
            html_url: "https://github.com/nooryoosuf/mlbb-codex",
            description:
                "A tactical, all-in-one companion for Mobile Legends: Bang Bang. Featuring a comprehensive Hero Codex (lore, mastery, and counters), real-time meta analytics, interactive drafting tools, and player performance tracking.",
            language: "TypeScript",
            stargazers_count: 0,
            pushed_at: "2026-10-22T09:20:13Z",
            visibility: "public",
        },
        content_blocks: [
            {
                type: "section",
                section_key: "the_idea",
                title: "The Idea",
                content:
                    "Game wikis are often cluttered with ads, slow tables, and fragmented pages. As someone who enjoys tactical games and lore, I wanted to see what a Mobile Legends knowledge archive would look like if it were treated like an editorial design system.",
            },
            {
                type: "section",
                section_key: "the_experiment",
                title: "The Experiment",
                content:
                    "Exploring how dense game data — hero stats, counters, item synergies, emblem builds, and ranked win/pick/ban rates — can be organized into fast, scannable views with instant filtering and interactive drafting tools.",
            },
            {
                type: "section",
                section_key: "the_process",
                title: "The Process",
                content:
                    "Built with Next.js App Router, React 19, and Tailwind CSS, structured as a static export so every hero profile, meta board, and patch breakdown loads instantaneously.",
            },
        ],
        created_at: "2026-10-22T09:20:13Z",
        updated_at: "2026-10-22T09:20:17Z",
    },
    {
        id: "exp-maldives-travel",
        title: "Maldives Travel Platform",
        slug: "maldives-travel-platform",
        short_description:
            "A travel discovery experience exploring guesthouse discovery, destination information, curated island guides, and Maldives geographical data.",
        full_story:
            "Built as IslandGo Maldives — a focused travel discovery web application connecting travelers with Maldivian destinations, stays, local experiences, packages, and direct contextual enquiries.",
        cover_image: "",
        gallery: [],
        category: "Web Projects",
        status: "Experimental",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "JSON-LD SEO"],
        year: "2026",
        color: "#0EA5E9",
        featured: false,
        published: true,
        live_url: "",
        github_url: "https://github.com/nooryoosuf/islandgo-maldives",
        github_metadata: {
            name: "islandgo-maldives",
            full_name: "nooryoosuf/islandgo-maldives",
            html_url: "https://github.com/nooryoosuf/islandgo-maldives",
            description:
                "IslandGo Maldives — travel discovery website (destinations, stays, experiences, packages, guides, enquiries). React + TS + Tailwind.",
            language: "TypeScript",
            stargazers_count: 0,
            pushed_at: "2026-11-02T06:47:06Z",
            visibility: "public",
        },
        content_blocks: [
            {
                type: "section",
                section_key: "the_idea",
                title: "The Idea",
                content:
                    "Discovering local islands and guesthouses in the Maldives often means jumping between scattered social media pages and heavyweight booking engines. This project explores a calm, photography-led discovery platform focused on helping visitors understand destinations, stays, and experiences first.",
            },
            {
                type: "section",
                section_key: "challenges",
                title: "Challenges & Decisions",
                content:
                    "A deliberate product decision early on was scoping out heavy booking engines and payment gateways in favor of structured destination discovery, multi-currency indicative pricing hints, translation-ready string architecture, and a unified contextual WhatsApp/email enquiry workflow.",
            },
        ],
        created_at: "2026-11-02T06:47:06Z",
        updated_at: "2026-11-02T06:47:10Z",
    },
    {
        id: "exp-asters-price-tracker",
        title: "Asters Price Tracker",
        slug: "asters-price-tracker",
        short_description:
            "An automation experiment for monitoring product prices, stock availability, and sending notifications when changes occur.",
        full_story:
            "A utility experiment built to track catalog price drops and restock events automatically instead of manually refreshing store listings.",
        cover_image: "",
        gallery: [],
        category: "Tools & Automation",
        status: "Experimental",
        technologies: ["Automation", "Web Scraping", "Notifications", "TypeScript"],
        year: "2026",
        color: "#10B981",
        featured: false,
        published: true,
        live_url: "",
        github_url: "",
        github_metadata: null,
        content_blocks: [
            {
                type: "section",
                section_key: "the_idea",
                title: "The Idea",
                content:
                    "Checking whether an item is back in stock or has changed price shouldn't require opening a browser tab every morning. Asters Price Tracker began as a small personal automation experiment to watch product listings and trigger a notification whenever price or availability shifts.",
            },
            {
                type: "section",
                section_key: "the_experiment",
                title: "The Experiment",
                content:
                    "Exploring lightweight scheduled checks, diffing product state cleanly, and filtering out noise so alerts only fire on meaningful price or stock changes.",
            },
        ],
        created_at: "2026-09-15T08:00:00Z",
        updated_at: "2026-09-15T08:00:00Z",
    },
    {
        id: "exp-espada-sc",
        title: "Espada SC",
        slug: "espada-sc",
        short_description:
            "A digital identity and community/event platform for an organization focused on organizing events and community activities.",
        full_story:
            "Exploring how a sports and community club's brand system can extend into a living web hub for events, announcements, and member engagement.",
        cover_image: "",
        gallery: [],
        category: "Web Projects",
        status: "In Progress",
        technologies: ["Brand Identity", "UI/UX", "Next.js", "Tailwind CSS"],
        year: "2026",
        color: "#F59E0B",
        featured: false,
        published: true,
        live_url: "",
        github_url: "",
        github_metadata: null,
        content_blocks: [
            {
                type: "section",
                section_key: "the_idea",
                title: "The Idea",
                content:
                    "Community clubs and tournament organizers put tremendous energy into physical events, but their digital presence often lives scattered across chat groups. Espada SC explores bringing club identity, event schedules, and community updates under one roof.",
            },
            {
                type: "section",
                section_key: "the_experiment",
                title: "The Experiment",
                content:
                    "Pairing a bold club crest and visual system with a clean, mobile-friendly event and community platform.",
            },
        ],
        created_at: "2026-09-01T08:00:00Z",
        updated_at: "2026-09-01T08:00:00Z",
    },
];

export const INITIAL_TINKERING: TinkeringItem[] = [
    {
        id: "tink-mino",
        title: "Ruh (Mino Budget Companion)",
        note: "Maldives-first personal finance & MVR salary-cycle budgeting app with custom SVG liquid-glass UI and BML SMS import foundation.",
        category: "Product Experiments",
        status: "Experimental",
        technologies: ["React 19", "TypeScript", "Capacitor", "Tailwind v4"],
        github_url: "https://github.com/nooryoosuf/mino-budget-app",
        live_url: "https://nooryoosuf.github.io/mino-budget-app/",
    },
    {
        id: "tink-dawnlore",
        title: "Land of Dawn — Lore Library",
        note: "An editorial, Netflix-inspired storytelling archive for Mobile Legends lore and faction histories.",
        category: "Creative Experiments",
        status: "Experimental",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
        github_url: "https://github.com/nooryoosuf/dawnlore",
    },
    {
        id: "tink-school-archive",
        title: "Maldives School Archive",
        note: "Community-driven digital vault preserving vector crests, color palettes, and visual heritage of Maldivian schools.",
        category: "Creative Experiments",
        status: "In Progress",
        technologies: ["Next.js 15", "TypeScript", "Framer Motion", "SVG"],
        github_url: "https://github.com/nooryoosuf/maldives-school-archive",
    },
    {
        id: "tink-memora",
        title: "Memora — QR Wedding Photo Sharing",
        note: "Mobile-first guest photo upload and editorial gallery experience triggered by scanning a table QR code.",
        category: "Ideas & Concepts",
        status: "In Progress",
        technologies: ["React", "TypeScript", "Tailwind CSS"],
        github_url: "https://github.com/nooryoosuf/memora",
    },
];

function readLocalExperiments(): ExperimentProject[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(LOCAL_EXPERIMENTS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function writeLocalExperiments(items: ExperimentProject[]) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(LOCAL_EXPERIMENTS_KEY, JSON.stringify(items));
    } catch {
        // ignore quota errors
    }
}

function readLocalTinkering(): TinkeringItem[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(LOCAL_TINKERING_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function writeLocalTinkering(items: TinkeringItem[]) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(LOCAL_TINKERING_KEY, JSON.stringify(items));
    } catch {
        // ignore
    }
}

/**
 * Fetches all experiments.
 * Priority:
 * 1. Dedicated `experiments` table in Supabase (if created & non-empty)
 * 2. `site_settings.about_text` JSON (`experiments_list`) in Supabase
 * 3. Browser localStorage override (if saved locally)
 * 4. `INITIAL_EXPERIMENTS` seed collection
 */
export async function fetchExperiments(options?: { includeDrafts?: boolean }): Promise<ExperimentProject[]> {
    const includeDrafts = options?.includeDrafts ?? false;
    let list: ExperimentProject[] | null = null;

    // 1. Check dedicated Supabase `experiments` table first
    try {
        const { data, error } = await supabase
            .from("experiments")
            .select("*")
            .order("created_at", { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
            list = data as ExperimentProject[];
        }
    } catch {
        // Table may not exist; fall through to site_settings
    }

    // 2. Check `site_settings.about_text` JSON store
    if (!list) {
        try {
            const { data } = await supabase.from("site_settings").select("about_text").single();
            if (data?.about_text) {
                const parsed = JSON.parse(data.about_text);
                if (Array.isArray(parsed.experiments_list) && parsed.experiments_list.length > 0) {
                    list = parsed.experiments_list as ExperimentProject[];
                }
            }
        } catch {
            // ignore
        }
    }

    // 3. Check localStorage fallback
    if (!list) {
        const local = readLocalExperiments();
        if (local && local.length > 0) {
            list = local;
        }
    }

    // 4. Default to initial seed projects
    if (!list || list.length === 0) {
        list = INITIAL_EXPERIMENTS;
    }

    return includeDrafts ? list : list.filter((item) => item.published !== false);
}

export async function fetchExperimentBySlug(
    slug: string,
    options?: { includeDrafts?: boolean }
): Promise<ExperimentProject | null> {
    const cleanSlug = decodeURIComponent(slug || "").trim().toLowerCase();
    if (!cleanSlug) return null;

    const all = await fetchExperiments({ includeDrafts: options?.includeDrafts ?? true });
    const found = all.find((item) => item.slug.toLowerCase() === cleanSlug);
    if (!found) return null;
    if (!options?.includeDrafts && found.published === false) return null;
    return found;
}

export async function fetchExperimentById(id: string): Promise<ExperimentProject | null> {
    if (!id) return null;
    const all = await fetchExperiments({ includeDrafts: true });
    return all.find((item) => item.id === id) || null;
}

/**
 * Persists the full experiments array to Supabase (`site_settings.about_text` and `experiments` table if available)
 * as well as localStorage so changes are immediately reflected.
 */
export async function saveExperimentsList(updatedList: ExperimentProject[]): Promise<void> {
    writeLocalExperiments(updatedList);

    const { data: existing } = await supabase.from("site_settings").select("about_text").single();
    let baseObj: Record<string, any> = {};
    if (existing?.about_text) {
        try {
            baseObj = JSON.parse(existing.about_text);
        } catch {
            baseObj = {};
        }
    }
    baseObj.experiments_list = updatedList;

    const { error } = await supabase
        .from("site_settings")
        .update({ about_text: JSON.stringify(baseObj) })
        .eq("id", "main");

    if (error) {
        throw error;
    }
}

export async function upsertExperiment(project: ExperimentProject): Promise<ExperimentProject> {
    const all = await fetchExperiments({ includeDrafts: true });
    const now = new Date().toISOString();
    const normalizedSlug = (project.slug || project.title)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    const record: ExperimentProject = {
        ...project,
        id: project.id || `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        slug: normalizedSlug,
        updated_at: now,
        created_at: project.created_at || now,
    };

    const existingIdx = all.findIndex((x) => x.id === record.id || x.slug === record.slug);
    let nextList: ExperimentProject[];
    if (existingIdx >= 0) {
        nextList = [...all];
        nextList[existingIdx] = record;
    } else {
        nextList = [record, ...all];
    }

    // Also attempt upsert into dedicated `experiments` table if present
    try {
        await supabase.from("experiments").upsert([record]);
    } catch {
        // ignore if table not present
    }

    await saveExperimentsList(nextList);
    return record;
}

export async function deleteExperimentById(id: string): Promise<ExperimentProject[]> {
    const all = await fetchExperiments({ includeDrafts: true });
    const nextList = all.filter((item) => item.id !== id);

    try {
        await supabase.from("experiments").delete().match({ id });
    } catch {
        // ignore if table not present
    }

    await saveExperimentsList(nextList);
    return nextList;
}

export async function fetchTinkeringItems(): Promise<TinkeringItem[]> {
    try {
        const { data } = await supabase.from("site_settings").select("about_text").single();
        if (data?.about_text) {
            const parsed = JSON.parse(data.about_text);
            if (Array.isArray(parsed.tinkering_list) && parsed.tinkering_list.length > 0) {
                return parsed.tinkering_list as TinkeringItem[];
            }
        }
    } catch {
        // ignore
    }

    const local = readLocalTinkering();
    if (local && local.length > 0) return local;

    return INITIAL_TINKERING;
}

export async function saveTinkeringItems(items: TinkeringItem[]): Promise<void> {
    writeLocalTinkering(items);

    const { data: existing } = await supabase.from("site_settings").select("about_text").single();
    let baseObj: Record<string, any> = {};
    if (existing?.about_text) {
        try {
            baseObj = JSON.parse(existing.about_text);
        } catch {
            baseObj = {};
        }
    }
    baseObj.tinkering_list = items;

    const { error } = await supabase
        .from("site_settings")
        .update({ about_text: JSON.stringify(baseObj) })
        .eq("id", "main");

    if (error) {
        throw error;
    }
}
