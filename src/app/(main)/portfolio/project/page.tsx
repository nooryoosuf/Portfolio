"use client";
import ProjectDetailContent from "@/components/ProjectDetailContent";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function ProjectViewer() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug") || "";
    return <ProjectDetailContent params={Promise.resolve({ slug })} />;
}

export default function ProjectPage() {
    return (
        <Suspense fallback={<div className="pt-40 pb-32 px-6 flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-zinc-100" size={48} /></div>}>
            <ProjectViewer />
        </Suspense>
    );
}
