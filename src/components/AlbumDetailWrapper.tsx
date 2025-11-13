import React from 'react';
import { useParams } from 'react-router-dom';
import { Alert, AlertTitle } from '@chakra-ui/react';
import AlbumDetailView from './Album/AlbumDetailView';

const AlbumDetailWrapper: React.FC = () => {
  const { artist, album } = useParams<{ artist: string; album: string }>();

  if (!artist || !album) {
    return (
      <Alert.Root status="error">
          <AlertTitle>Missing params in the URL.</AlertTitle>
      </Alert.Root>
    );
  }

  const decodedArtist = decodeURIComponent(artist);
  const decodedAlbum = decodeURIComponent(album);

  return <AlbumDetailView artistName={decodedArtist} albumName={decodedAlbum} />;
};

export default AlbumDetailWrapper;