import { create } from "zustand";
import type { FavouriteTrack, TopAlbum } from "../types/lastfm";

interface AlbumState {
  albums: TopAlbum[];
  artistName: string;
  setAlbums: (albums: TopAlbum[]) => void;

  query: string;
  setQuery: (query: string) => void;

  favourites: FavouriteTrack[];
  addFavourite: (track: FavouriteTrack) => void;
  removeFavourite: (trackId: string) => void;
  isFavourited: (trackId: string) => boolean;
}

export const useAlbumStore = create<AlbumState>((set, get) => ({
  albums: [],
  artistName: "Cher",
  setAlbums: (albums) => set({ albums }),

  query: "",
  setQuery: (query) => set({ query }),

  favourites: [],

  addFavourite: (track) => {
    set((state) => ({
      favourites: [...state.favourites, track],
    }));
  },

  removeFavourite: (trackId) => {
    set((state) => ({
      favourites: state.favourites.filter((track) => track.id !== trackId),
    }));
  },

  isFavourited: (trackId) => {
    return get().favourites.some((track) => track.id === trackId);
  },
}));
