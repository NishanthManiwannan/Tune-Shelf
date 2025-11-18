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
    Tag,
    AlertTitle
} from '@chakra-ui/react';
import type { AlbumDetail, Track } from '../../types/lastfm';
import { getAlbumInfo } from '../../api/lastfmapi';
import { getImageUrl } from '../../utils';
import Table from '../../pages/Table';

interface AlbumDetailViewProps {
    artistName: string;
    albumName: string;
}

const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({ artistName, albumName }) => {
    const [album, setAlbum] = useState<AlbumDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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


    return (
        <Box p={8}>
            <HStack gap={8} align="flex-start" mb={8}>
                <Image
                    src={getImageUrl(album.image)}
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

            <Table tracks={tracks} albumName={albumName} />

        </Box>
    );
};

export default AlbumDetailView;