export interface LastFmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge";
}

export interface BaseArtist {
  name: string;
  url: string;
}

export interface BaseAlbum {
  name: string;
  artist: string | BaseArtist;
  url: string;
  image: LastFmImage[];
}

export interface Track {
  image: LastFmImage[];
  name: string;
  url: string;
  duration: string;
  artist: BaseArtist;
}

export interface TopAlbum extends BaseAlbum {
  artist: BaseArtist; 
  playcount: string;
  mbid: string;
}

export interface GetTopAlbumsResponse {
  topalbums: {
    album: TopAlbum[];
  };
}

export interface AlbumDetail extends BaseAlbum {
  artist: string;
  tracks: {
    track: Track[];
  };
  tags: {
    tag: { name: string; url: string }[];
  };
  wiki?: {
    published: string;
    summary: string;
    content: string;
  };
  releasedate?: string;
}

export interface GetAlbumInfoResponse {
  album: AlbumDetail;
}