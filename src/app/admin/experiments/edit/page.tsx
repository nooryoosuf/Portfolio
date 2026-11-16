"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ExperimentForm from "@/components/admin/ExperimentForm";

function EditExperimentInner() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    return <ExperimentForm experimentId={id} />;
}

export default function EditExperimentPage() {
    return (
        <Suspense fallback={<p className="eyebrow animate-pulse py-24 text-center">Loading editor</p>}>
            <EditExperimentInner />
        </Suspense>
    );
}
