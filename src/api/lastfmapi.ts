import axios from "axios";
import type {
  AlbumDetail,
  GetAlbumInfoResponse,
  GetTopAlbumsResponse,
  TopAlbum,
  TopTrackResponse,
  Track,
} from "../types/lastfm";

const API_KEY = import.meta.env.VITE_REACT_APP_LASTFM_API_KEY;
const BASE_URL =
  import.meta.env.VITE_REACT_APP_BASE_URL ||
  "https://ws.audioscrobbler.com/2.0/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    format: "json",
    api_key: API_KEY,
  },
});

export const getTopAlbums = async (artist: string): Promise<TopAlbum[]> => {
  const response = await apiClient.get<GetTopAlbumsResponse>("/", {
    params: {
      method: "artist.getTopAlbums",
      artist: artist,
    },
  });
  return response.data.topalbums.album;
};

export const getAlbumInfo = async (
  artist: string,
  album: string
): Promise<AlbumDetail> => {
  const response = await apiClient.get<GetAlbumInfoResponse>("/", {
    params: {
      method: "album.getInfo",
      artist: artist,
      album: album,
    },
  });
  return response.data.album;
};

export const getTopTracks = async (): Promise<Track[]> => {
  const response = await apiClient.get<TopTrackResponse>("/", {
    params: {
      method: "chart.gettoptracks",
    },
  });
  return response.data.tracks.track;
};
