import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { Box, Heading, Text, Center } from '@chakra-ui/react';
import type { TopAlbum, Track } from '../../types/lastfm';

interface ChartData {
    name: string;
    plays: number;
}

interface BestPlayedGraphProps {
    tracks: TopAlbum[] | Track[];
    chartType: 'bar' | 'line';
}

const BestPlayedGraph: React.FC<BestPlayedGraphProps> = ({ tracks, chartType }) => {
        const check = chartType === 'bar'

    const chartData: ChartData[] = tracks
        .map(track => ({
            name: track.name,
            plays: track.playcount ? parseInt(track.playcount) : 0,
        }))
        .slice(0, check ? 6 : 10);
    if (chartData.length === 0) {
        return (
            <Center height="200px" borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
                <Text color="gray.500">
                    Play count data is not available for these tracks via the Last.fm API.
                </Text>
            </Center>
        );
    }

    const Chart = check ? BarChart : LineChart;
    const ChartFooter = check ? Bar : Line;

    return (
        <Box mt={2} p={2} borderWidth="1px" borderRadius="lg" shadow="md">
            <Heading as="h4" size="md" mb={4}>{check ? 'Most Played Album by artist' : 'Most Played Tracks'}</Heading>
            <ResponsiveContainer width="100%" height={check ? 310 : 600}>
                <Chart
                    data={chartData}
                    margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="1 1" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={200} tick={{ fontSize: 5 }} />
                    <Tooltip
                        formatter={(value: number) => [value.toLocaleString(), 'Play Count']}
                    />
                    <Legend />
                    <ChartFooter dataKey="plays" fill="#8884d8" name="Play Count" />
                </Chart>
            </ResponsiveContainer>
        </Box>
    );
};

export default BestPlayedGraph;