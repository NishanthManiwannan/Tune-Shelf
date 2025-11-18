import { Table } from '@chakra-ui/react/table';
import React from 'react';
import { formatDuration } from '../utils';
import { useAlbumStore } from '../store/albumStore';
import type { FavouriteTrack, Track } from '../types/lastfm';
import { Button } from '@chakra-ui/react';

const AlbumDetailWrapper: React.FC<{ tracks: Track[], albumName: string }> = ({ tracks, albumName }) => {
    const { addFavourite, removeFavourite, isFavourited } = useAlbumStore();

    function toggleFavourite(track: Track): void {
        const trackId = `${albumName}-${track.name}-${track.artist.name}`;

        if (isFavourited(trackId)) {
            removeFavourite(trackId);
        } else {
            const newFavourite: FavouriteTrack = {
                id: trackId,
                name: track.name,
                artist: track.artist.name,
                duration: track.duration,
                album: albumName,
            };
            addFavourite(newFavourite);
        }
    }

    return <>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Title</Table.ColumnHeader>
                    <Table.ColumnHeader>Artist</Table.ColumnHeader>
                    <Table.ColumnHeader>Duration</Table.ColumnHeader>
                    <Table.ColumnHeader />
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {tracks.map((track) => {
                    const trackId = `${albumName}-${track.name}-${track.artist.name}`;
                    const isFav = isFavourited(trackId);

                    return (
                        <Table.Row key={track.url}>
                            <Table.Cell>{track.name}</Table.Cell>
                            <Table.Cell>{track.artist.name}</Table.Cell>
                            <Table.Cell>{formatDuration(track.duration)}</Table.Cell>
                            <Table.Cell>
                                <Button
                                    size="sm"
                                    variant={isFav ? "solid" : "subtle"}
                                    onClick={() => toggleFavourite(track)}
                                >
                                    {isFav ? "Remove" : "Add"} Favourite
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table.Root>
    </>
};

export default AlbumDetailWrapper;