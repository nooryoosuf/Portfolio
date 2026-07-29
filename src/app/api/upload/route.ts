import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Try uploading to 'media' first, or fallback to 'portfolio_website_bucket'
        let bucketName = "media";

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        let { error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, buffer, {
                contentType: file.type || "image/png",
                upsert: true
            });

        if (error && error.message?.includes("not found")) {
            bucketName = "portfolio_website_bucket";
            const retry = await supabase.storage
                .from(bucketName)
                .upload(filePath, buffer, {
                    contentType: file.type || "image/png",
                    upsert: true
                });
            error = retry.error;
        }

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}

