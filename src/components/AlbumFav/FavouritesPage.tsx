import React from 'react';
import {
    Box,
    Heading,
    Table,
    Button,
    Alert,
    Text
} from '@chakra-ui/react';
import { useAlbumStore } from '../../store/albumStore';
import { useNavigate } from 'react-router-dom';

const formatDuration = (secondsStr: string): string => {
    const totalSeconds = parseInt(secondsStr, 10);
    if (isNaN(totalSeconds) || totalSeconds === 0) return "0:00";

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const FavouritesPage: React.FC = () => {
    const { favourites, removeFavourite } = useAlbumStore();

    const navigate = useNavigate();
    const handleClickSong = (artist: string, album: string) => navigate(`/album/${artist}/${album}`);

    return (
        <Box p={4}>
            <Heading as="h2" size="xl" mb={6}>Favourites Tracks</Heading>

            {favourites.length === 0 ? (
                <Alert.Root status="info">
                    You haven't added any songs to your favourites yet!
                </Alert.Root>
            ) : (
                <Table.Root colorScheme="purple">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Title</Table.ColumnHeader>
                            <Table.ColumnHeader>Album</Table.ColumnHeader>
                            <Table.ColumnHeader>Artist</Table.ColumnHeader>
                            <Table.ColumnHeader>Duration</Table.ColumnHeader>
                            <Table.ColumnHeader>Action</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {favourites.map((track) => (
                            <Table.Row key={track.id}>
                                <Table.Cell>
                                    <Text
                                        fontWeight="bold"
                                        onClick={() => handleClickSong(track.artist, track.album)}
                                        cursor="pointer"
                                        _hover={{ textDecoration: 'underline' }}
                                    >
                                        {track.name}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell>{track.album}</Table.Cell>
                                <Table.Cell>{track.artist}</Table.Cell>
                                <Table.Cell>{formatDuration(track.duration)}</Table.Cell>
                                <Table.Cell>
                                    <Button
                                        size="sm"
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() => removeFavourite(track.id)}
                                    >
                                        Remove favourites
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </Box>
    );
};

export default FavouritesPage;