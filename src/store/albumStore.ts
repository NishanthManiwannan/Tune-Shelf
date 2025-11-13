import { create } from "zustand";
import type { TopAlbum } from "../types/lastfm";

interface AlbumState {
  albums: TopAlbum[];
  artistName: string;
  setAlbums: (albums: TopAlbum[]) => void;
}

export const useAlbumStore = create<AlbumState>((set) => ({
  albums: [],
  artistName: "Cher",
  setAlbums: (albums) => set({ albums }),
}));
