import React from 'react';
import { useAlbumStore } from '../store/albumStore';
import AlbumOverview from './Album/AlbumOverview';
import { Box } from '@chakra-ui/react';
import SearchComponent from './Search/SearchComponent';

const MainScreen: React.FC = () => {
    const { albums, artistName, setAlbums } = useAlbumStore();

    return (
        <div>
            <Box mb={8}>
                <SearchComponent setAlbums={setAlbums} artistName={artistName} />
            </Box>
            <AlbumOverview setAlbums={setAlbums} albums={albums} artistName={artistName} />
        </div>
    );
};

export default MainScreen;