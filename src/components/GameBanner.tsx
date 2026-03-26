"use client";

import { useState, useEffect } from "react";
import { Gamepad2 } from "lucide-react";

interface GameBannerProps {
  appid?: number;
  name: string;
}

export default function GameBanner({ appid, name }: GameBannerProps) {
  const [src, setSrc] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (appid) {
        setSrc(`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`);
    }
  }, [appid]);

  const handleError = () => {
    if (appid) {
        if (retry === 0) {
            setSrc(`https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`);
            setRetry(1);
        } else if (retry === 1) {
            setSrc(`https://cdn.akamai.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`);
            setRetry(2);
        } else {
            setSrc(""); // Final fallback
        }
    }
  };

  if (!src) {
    return (
        <div className="w-full h-full bg-[#0d1117] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#a0c0d0_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative text-center p-4">
                <Gamepad2 className="w-12 h-12 text-primary/20 mx-auto mb-2" />
                <p className="text-[10px] font-black text-primary/40 tracking-[0.3em] uppercase">{name}</p>
            </div>
        </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name}
      onError={handleError}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90 grayscale-[0.3] group-hover:grayscale-0"
    />
  );
}
