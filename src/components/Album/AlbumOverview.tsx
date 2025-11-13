import React, { useEffect, useMemo, useState } from 'react';
import { SimpleGrid, Box, Image, Text, Spinner, Alert, VStack, AlertTitle, HStack, Button } from '@chakra-ui/react';
import { getTopAlbums } from '../../api/lastfmapi';
import { useNavigate } from 'react-router-dom';
import type { AlbumOverviewProps, LastFmImage } from '../../types/lastfm';
import BestPlayedGraph from '../Graph/BestPlayedGraph';

type SortKey = "name" | "playcount";

const AlbumOverview: React.FC<AlbumOverviewProps> = ({ albums, artistName, setAlbums }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [sortBy, setSortBy] = useState<SortKey>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const getImageUrl = (images: LastFmImage[],) => {
        const img = images.find(i => i.size === 'large');
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

    const sortedAlbums = useMemo(() => {
        if (albums.length === 0) return [];

        const sortableAlbums = [...albums];

        sortableAlbums.sort((a, b) => {
            let comparison = 0;

            if (sortBy === "name") {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();

                if (nameA > nameB) comparison = 1;
                else if (nameA < nameB) comparison = -1;
            } else if (sortBy === "playcount") {
                const countA = parseInt(a.playcount || "0", 10);
                const countB = parseInt(b.playcount || "0", 10);
                comparison = countA - countB;
            }

            return sortDirection === "asc" ? comparison : comparison * -1;
        });

        return sortableAlbums;
    }, [albums, sortBy, sortDirection]);

    const getSortIcon = (key: SortKey) => {
        if (sortBy !== key) return null;

        if (key === "name") {
            return sortDirection === "asc" ? '▼' : '▲';
        } else if (key === "playcount") {
            return sortDirection === "asc" ? '▼' : '▲';
        }
        return null;
    };

    const handleSortChange = (key: SortKey) => {
        if (sortBy === key) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(key);
            setSortDirection("asc");
        }
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
            <BestPlayedGraph tracks={albums} chartType="bar" />

            <HStack gap={4} mb={4} mt={8}>
                <Text fontWeight="bold">Sort Albums By:</Text>
                <Button
                    onClick={() => handleSortChange("name")}
                    variant={sortBy === "name" ? "solid" : "outline"}
                >
                    {getSortIcon("name")} Name
                </Button>
                <Button
                    onClick={() => handleSortChange("playcount")}
                    variant={sortBy === "playcount" ? "solid" : "outline"}
                >
                    {getSortIcon("playcount")} Play Count
                </Button>
            </HStack>

            <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} gap={6}>
                {sortedAlbums.map((album) => (
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