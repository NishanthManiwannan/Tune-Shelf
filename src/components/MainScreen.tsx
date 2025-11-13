import React from 'react';
import { useAlbumStore } from '../store/albumStore';
import AlbumOverview from './Album/AlbumOverview';

const MainScreen: React.FC = () => {
    const { albums, artistName, setAlbums } = useAlbumStore();

    return (
        <div>
            <AlbumOverview setAlbums={setAlbums} albums={albums} artistName={artistName} />
        </div>
    );
};

export default MainScreen;