import { projects } from "@/data/projects";
import ProjectDetailContent from "@/components/ProjectDetailContent";

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    return <ProjectDetailContent params={params} />;
}
