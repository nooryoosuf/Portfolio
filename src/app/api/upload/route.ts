import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const projectRef = new URL(supabaseUrl).host.split(".")[0];

const s3 = new S3Client({
    region: "ap-southeast-1",
    endpoint: `https://${projectRef}.storage.supabase.co`,
    credentials: {
        accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
    },
});

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

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await s3.send(
            new PutObjectCommand({
                Bucket: "portfolio_website_bucket",
                Key: filePath,
                Body: buffer,
                ContentType: file.type,
            })
        );

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/portfolio_website_bucket/${filePath}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
