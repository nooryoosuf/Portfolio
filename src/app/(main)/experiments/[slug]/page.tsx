import type { Metadata } from "next";
import ExperimentDetailContent from "@/components/ExperimentDetailContent";
import { INITIAL_EXPERIMENTS, fetchExperimentBySlug, fetchExperiments } from "@/lib/experiments";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    try {
        const { slug } = await params;
        const exp = await fetchExperimentBySlug(slug, { includeDrafts: true });
        if (!exp) {
            return {
                title: { absolute: "Experiments — Noor Yoosuf" },
                description:
                    "A collection of ideas, experiments, side projects and software builds by Noor Yoosuf.",
            };
        }

        const title = `${exp.title} — Experiments — Noor Yoosuf`;
        const description =
            exp.short_description ||
            `${exp.category || "Experimental"} build log by Noor Yoosuf.`;

        return {
            title: { absolute: title },
            description,
            openGraph: {
                title,
                description,
                type: "article",
                ...(exp.cover_image ? { images: [{ url: exp.cover_image }] } : {}),
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                ...(exp.cover_image ? { images: [exp.cover_image] } : {}),
            },
        };
    } catch {
        return { title: "Experiments — Noor Yoosuf" };
    }
}

export async function generateStaticParams() {
    try {
        const list = await fetchExperiments({ includeDrafts: true });
        const slugs = new Set<string>(INITIAL_EXPERIMENTS.map((x) => x.slug));
        list.forEach((item) => {
            if (item?.slug) slugs.add(item.slug);
        });
        return Array.from(slugs).map((slug) => ({ slug }));
    } catch {
        return INITIAL_EXPERIMENTS.map((x) => ({ slug: x.slug }));
    }
}

export default function ExperimentDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    return <ExperimentDetailContent params={params} />;
}
