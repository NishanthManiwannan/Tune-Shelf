import React, { useEffect, useState } from 'react';
import { SimpleGrid, Box, Image, Text, Spinner, Alert, VStack, AlertTitle} from '@chakra-ui/react';
import { getTopAlbums } from '../../api/lastfmapi';
import { useNavigate } from 'react-router-dom';
import type { AlbumOverviewProps, LastFmImage } from '../../types/lastfm';

const AlbumOverview: React.FC<AlbumOverviewProps> = ({ albums, artistName, setAlbums }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const getImageUrl = (images: LastFmImage[], size: string = 'large') => {
        const img = images.find(i => i.size === size);
        return img ? img['#text'] : '';
    };

    useEffect(() => {
        const loadAlbums = async () => {
            try {
                setIsLoading(true);
                const topAlbums = await getTopAlbums(artistName);
                setAlbums(topAlbums);
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

        loadAlbums();
    }, [artistName, setAlbums]);

    const handleAlbumClick = (artist: string, albumName: string) => {
        const encodedArtist = encodeURIComponent(artist);
        const encodedAlbum = encodeURIComponent(albumName);

        navigate(`/album/${encodedArtist}/${encodedAlbum}`);
    };

    if (isLoading) {
        return <>
            <VStack gap={4}>
                <Spinner size="xl" color="purple.500" />
            </VStack>
        </>
    }

    if (error) {
        return (
            <Alert.Root status="error">
                <AlertTitle>{error}</AlertTitle>
            </Alert.Root>
        );
    }

    return (
        <>
            <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} gap={6}>
                {albums.map((album) => (
                    <Box
                        key={album.name + album.artist}
                        p={3}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="lg"
                        cursor={"pointer"}
                        _hover={{ transform: "translateY(-6px)", shadow: "lg" }}
                        onClick={() => handleAlbumClick(album.artist.name, album.name)}
                    >
                        <Image src={getImageUrl(album.image)} alt={album.name} borderRadius="md" />
                        <Text mt={2} fontWeight="bold">{album.name}</Text>
                        <Text fontSize="sm" color="gray.500">{album.artist.name}</Text>
                    </Box>
                ))}
            </SimpleGrid>
        </>
    );
};

export default AlbumOverview;