"use client";

import { useState } from "react";

interface GameImageProps {
  appid: string | number;
  alt: string;
  className?: string;
}

export default function GameImage({ appid, alt, className }: GameImageProps) {
  const [src, setSrc] = useState(`https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`);
  const [fallbackCount, setFallbackCount] = useState(0);

  const fallbacks = [
    `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
    `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`,
    `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/capsule_616x353.jpg`,
  ];

  const handleError = () => {
    if (fallbackCount < fallbacks.length) {
      setSrc(fallbacks[fallbackCount]);
      setFallbackCount(fallbackCount + 1);
    } else if (fallbackCount === fallbacks.length) {
      setSrc("/game-fallback.png");
      setFallbackCount(fallbackCount + 1);
    }
  };

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={handleError} 
      className={className} 
    />
  );
}
