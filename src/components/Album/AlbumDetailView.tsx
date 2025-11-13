import React, { useEffect, useState } from 'react';
import {
    Box,
    Text,
    Image,
    Spinner,
    Alert,
    VStack,
    Heading,
    HStack,
    Table,
    Tag,
    Button,
    AlertTitle
} from '@chakra-ui/react';
import type { AlbumDetail, FavouriteTrack, LastFmImage, Track } from '../../types/lastfm';
import { getAlbumInfo } from '../../api/lastfmapi';
import { useAlbumStore } from '../../store/albumStore';

interface AlbumDetailViewProps {
    artistName: string;
    albumName: string;
}

const formatDuration = (secondsStr: string): string => {
    const totalSeconds = parseInt(secondsStr, 10);
    if (isNaN(totalSeconds) || totalSeconds === 0) return "0:00";

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const getLargeImageUrl = (images: LastFmImage[]) => {
    const img = images.find(i => i.size === 'large');
    return img ? img['#text'] : '';
};

const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({ artistName, albumName }) => {
    const [album, setAlbum] = useState<AlbumDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addFavourite, removeFavourite, isFavourited } = useAlbumStore();

    useEffect(() => {
        const loadDetails = async () => {
            try {
                setIsLoading(true);
                const details = await getAlbumInfo(artistName, albumName);
                setAlbum(details);
                setError(null);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadDetails();
    }, [artistName, albumName]);

    if (isLoading) {
        return (
            <VStack gap={4}>
                <Spinner size="xl" color="purple.500" />
                <Text>Loading album details...</Text>
            </VStack>
        );
    }

    if (error) {
        return (
            <Alert.Root status="error">
                <AlertTitle>{error}</AlertTitle>
            </Alert.Root>
        );
    }

    if (!album) {
        return <Alert.Root status="info">Album details could not be loaded.</Alert.Root>;
    }

    const tracks: Track[] = album.tracks?.track || [];

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

    return (
        <Box p={8}>
            <HStack gap={8} align="flex-start" mb={8}>
                <Image
                    src={getLargeImageUrl(album.image)}
                    alt={album.name}
                    boxSize="400px"
                    objectFit="cover"
                    borderRadius="lg"
                />
                <VStack align="flex-start" gap={3}>
                    <Heading as="h2" size="xl">{album.name}</Heading>
                    <Text fontSize="lg" color="gray.400">By : {album.artist}</Text>

                    {album.releasedate ? (
                        <Tag.Root size="xl">
                            Released: {album.releasedate.split(',')[0].trim()}
                        </Tag.Root>
                    ) : (
                        <Tag.Root size="xl">
                            Release Date: Unknown
                        </Tag.Root>
                    )}

                    {album.wiki?.summary && (
                        <Text mt={5} textAlign="justify" dangerouslySetInnerHTML={{ __html: album.wiki.summary }} fontSize="sm" />
                    )}
                </VStack>
            </HStack>

            <Heading size="xl" mt={10} mb={4}>Track List</Heading>

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
        </Box>
    );
};

export default AlbumDetailView;