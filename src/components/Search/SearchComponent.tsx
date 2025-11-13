import React, { useState, useCallback } from 'react';
import {
    Input,
    Button,
    VStack,
    HStack,
    Spinner,
    Alert,
    AlertTitle,
} from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import { getTopAlbums } from '../../api/lastfmapi';
import type { SearchComponentProps } from '../../types/lastfm';

const SearchComponent: React.FC<SearchComponentProps> = ({ setAlbums, artistName }) => {
    const [query, setQuery] = useState('');
    const [searchType] = useState<'artist' | 'track'>('artist');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useCallback(
        debounce(async (searchValue: string) => {
            if (searchValue.length < 3) {
                const topAlbums = await getTopAlbums(artistName);
                setAlbums(topAlbums);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const data = await getTopAlbums(searchValue);
                setAlbums(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Error fetching search results.');
                }
                setAlbums([]);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        [artistName, setAlbums]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    return (
        <VStack gap={4} align="stretch" w="100%">
            <HStack gap={3}>
                <Input
                    placeholder={`Search for a ${searchType} name...`}
                    value={query}
                    onChange={handleInputChange}
                    flex="3"
                />
                <Button onClick={() => debouncedSearch.flush()}>
                    Search
                </Button>
            </HStack>

            {isLoading && <><VStack gap={4}>
                <Spinner size="xl" color="purple.500" />
            </VStack>
            </>}

            {error && (
                <Alert.Root status="error">
                    <AlertTitle>{error}</AlertTitle>
                </Alert.Root>
            )}
        </VStack>
    );
};

export default SearchComponent;