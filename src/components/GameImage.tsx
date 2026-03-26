"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface GameImageProps {
  appid: string | number;
  alt: string;
  className?: string;
}

export default function GameImage({ appid, alt, className }: GameImageProps) {
  const [src, setSrc] = useState(`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`);
  const [fallbackCount, setFallbackCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const fallbacks = [
    `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
    `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`,
    `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_616x353.jpg`,
  ];

  const handleError = () => {
    if (fallbackCount < fallbacks.length) {
      setSrc(fallbacks[fallbackCount]);
      setFallbackCount(fallbackCount + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-zinc-900 border border-white/5 text-center p-4 min-h-[100px]", className)}>
        <p className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase">NOT AVAILABLE</p>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={handleError} 
      className={className} 
    />
  );
}
