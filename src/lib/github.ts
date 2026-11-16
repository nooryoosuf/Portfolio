export interface GitHubRepoMetadata {
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    topics: string[];
    stargazers_count: number;
    pushed_at: string | null;
    updated_at: string | null;
    visibility: string;
    homepage?: string | null;
    fetched_at?: string;
}

const CACHE_PREFIX = "gh_repo_meta_v1:";
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

/**
 * Extracts "owner/repo" from a GitHub URL or "owner/repo" shorthand.
 * Returns null if the input is not a valid public GitHub repo reference.
 */
export function parseGitHubRepo(input?: string | null): string | null {
    if (!input || typeof input !== "string") return null;
    const trimmed = input.trim();
    if (!trimmed) return null;

    const urlMatch = trimmed.match(
        /^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git|\/.*)?$/i
    );
    if (urlMatch) {
        return `${urlMatch[1]}/${urlMatch[2]}`;
    }

    const shortMatch = trimmed.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
    if (shortMatch) {
        return `${shortMatch[1]}/${shortMatch[2]}`;
    }

    return null;
}

/**
 * Fetches public repository metadata from the unauthenticated GitHub REST API.
 * - Never exposes tokens in frontend code.
 * - Ignores private repositories.
 * - Caches responses in localStorage to respect rate limits.
 * - Falls back to provided fallbackMetadata if offline or rate-limited.
 */
export async function fetchGitHubRepoMetadata(
    repoUrlOrSlug?: string | null,
    fallbackMetadata?: Partial<GitHubRepoMetadata> | null
): Promise<GitHubRepoMetadata | null> {
    const slug = parseGitHubRepo(repoUrlOrSlug);
    if (!slug) return null;

    const cacheKey = `${CACHE_PREFIX}${slug.toLowerCase()}`;

    if (typeof window !== "undefined") {
        try {
            const raw = window.localStorage.getItem(cacheKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed?.data && parsed?.ts && Date.now() - parsed.ts < CACHE_TTL_MS) {
                    return parsed.data as GitHubRepoMetadata;
                }
            }
        } catch {
            // ignore storage read errors
        }
    }

    try {
        const res = await fetch(`https://api.github.com/repos/${slug}`, {
            headers: {
                Accept: "application/vnd.github+json",
            },
        });

        if (!res.ok) {
            throw new Error(`GitHub API responded with ${res.status}`);
        }

        const data = await res.json();

        // Never expose private repository data
        if (data.private) {
            return null;
        }

        const meta: GitHubRepoMetadata = {
            name: data.name || slug.split("/")[1],
            full_name: data.full_name || slug,
            html_url: data.html_url || `https://github.com/${slug}`,
            description: data.description || null,
            language: data.language || null,
            topics: Array.isArray(data.topics) ? data.topics : [],
            stargazers_count: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
            pushed_at: data.pushed_at || null,
            updated_at: data.updated_at || null,
            visibility: data.visibility || "public",
            homepage: data.homepage || null,
            fetched_at: new Date().toISOString(),
        };

        if (typeof window !== "undefined") {
            try {
                window.localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: meta }));
            } catch {
                // ignore quota errors
            }
        }

        return meta;
    } catch {
        if (fallbackMetadata && fallbackMetadata.full_name) {
            return {
                name: fallbackMetadata.name || slug.split("/")[1],
                full_name: fallbackMetadata.full_name || slug,
                html_url: fallbackMetadata.html_url || `https://github.com/${slug}`,
                description: fallbackMetadata.description ?? null,
                language: fallbackMetadata.language ?? null,
                topics: Array.isArray(fallbackMetadata.topics) ? fallbackMetadata.topics : [],
                stargazers_count: fallbackMetadata.stargazers_count ?? 0,
                pushed_at: fallbackMetadata.pushed_at ?? null,
                updated_at: fallbackMetadata.updated_at ?? null,
                visibility: fallbackMetadata.visibility || "public",
                homepage: fallbackMetadata.homepage ?? null,
            };
        }
        return {
            name: slug.split("/")[1],
            full_name: slug,
            html_url: `https://github.com/${slug}`,
            description: null,
            language: null,
            topics: [],
            stargazers_count: 0,
            pushed_at: null,
            updated_at: null,
            visibility: "public",
        };
    }
}
