import React from "react";
import { SiFigma, SiAdobephotoshop, SiAdobeillustrator, SiAdobepremierepro, SiAdobexd } from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa6";

interface SoftwareIconProps {
    name: string;
    size?: number;
    className?: string;
}

export default function SoftwareIcon({ name, size = 24, className = "" }: SoftwareIconProps) {
    const lower = name.toLowerCase();

    if (lower.includes("figma")) {
        return <SiFigma size={size} className={`text-[#F24E1E] ${className}`} />;
    }
    if (lower.includes("photoshop")) {
        return <SiAdobephotoshop size={size} className={`text-[#31A8FF] ${className}`} />;
    }
    if (lower.includes("illustrator")) {
        return <SiAdobeillustrator size={size} className={`text-[#FF9A00] ${className}`} />;
    }
    if (lower.includes("premiere") || lower.includes("premiuer")) {
        return <SiAdobepremierepro size={size} className={`text-[#9999FF] ${className}`} />;
    }
    if (lower.includes("xd")) {
        return <SiAdobexd size={size} className={`text-[#FF61F6] ${className}`} />;
    }
    if (lower.includes("office") || lower.includes("microsoft") || lower.includes("word") || lower.includes("excel") || lower.includes("ms")) {
        return <FaMicrosoft size={size} className={`text-[#D83B01] ${className}`} />;
    }

    return <SiFigma size={size} className={`text-zinc-900 ${className}`} />;
}
