import { Box, Heading } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import BestPlayedGraph from './BestPlayedGraph';
import { getTopTracks } from '../../api/lastfmapi';
import type { Track } from '../../types/lastfm';

const TrackListGraph: React.FC = () => {
    const [tracks, setTracks] = useState<Track[]>([]);

    useEffect(() => {
        const loadDetails = async () => {
            const tracks = await getTopTracks()
            setTracks(tracks);
        }

        loadDetails()
    }, []);

    return (<Box p={4}>
        <Heading as="h2" size="xl" mb={6}>Most Played Tracks</Heading>
        <BestPlayedGraph tracks={tracks} chartType="line" />
    </Box>
    );
};

export default TrackListGraph;