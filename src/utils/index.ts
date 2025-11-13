import type { LastFmImage } from "../types/lastfm";

export const getImageUrl = (images: LastFmImage[]) => {
  const img = images.find((i) => i.size === "large");
  return img ? img["#text"] : "";
};

export const formatDuration = (secondsStr: string): string => {
    const totalSeconds = parseInt(secondsStr, 10);
    if (isNaN(totalSeconds) || totalSeconds === 0) return "0:00";

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};