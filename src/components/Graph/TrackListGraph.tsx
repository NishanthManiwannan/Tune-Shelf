import { Alert, AlertTitle, Box, Heading, Spinner, VStack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import BestPlayedGraph from './BestPlayedGraph';
import { getTopTracks } from '../../api/lastfmapi';
import type { Track } from '../../types/lastfm';

const TrackListGraph: React.FC = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const tracks = await getTopTracks()
                setTracks(tracks);
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
        }

        loadDetails()
    }, []);

    if (error) {
        return (
            <Alert.Root status="error">
                <AlertTitle>{error}</AlertTitle>
            </Alert.Root>
        );
    }

    if (isLoading) {
        return (
            <VStack gap={4}>
                <Spinner size="xl" color="purple.500" />
                <Text>Loading Graph</Text>
            </VStack>
        );
    }

    return (<Box p={4}>
        <Heading as="h2" size="xl" mb={6}>Most Played Tracks</Heading>
        <BestPlayedGraph tracks={tracks} chartType="line" />
    </Box>
    );
};

export default TrackListGraph;