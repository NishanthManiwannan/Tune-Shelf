import React from 'react';
import {
    Text,
} from '@chakra-ui/react';

interface AlbumDetailViewProps {
    artistName: string;
    albumName: string;
}

const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({ artistName, albumName }) => {
    return (<Text>Album Details for {albumName} by {artistName}</Text>);

};

export default AlbumDetailView;