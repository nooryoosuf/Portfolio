"use client";
import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            onChange(publicUrl);
        } catch (error: any) {
            alert("Error uploading image: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{label}</label>}

            <div
                onClick={() => !value && fileInputRef.current?.click()}
                className={`relative aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-4
                    ${value ? 'border-zinc-200 bg-white' : 'border-zinc-100 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100'}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept="image/*"
                    className="hidden"
                />

                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-razzmatazz" size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Uploading...</span>
                    </div>
                ) : value ? (
                    <>
                        <img src={value} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full backdrop-blur-md hover:bg-razzmatazz transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                        <Upload size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Select Image</span>
                    </div>
                )}
            </div>
        </div>
    );
}
