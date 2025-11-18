import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { useAlbumStore } from '../../store/albumStore';

const SearchComponent: React.FC<SearchComponentProps> = ({ setAlbums, artistName }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { query, setQuery } = useAlbumStore()

    const fetchResults = useCallback(async (searchValue: string) => {
        try {

            if (searchValue.length < 3) {
                const topAlbums = await getTopAlbums(artistName);
                setAlbums(topAlbums);
                return;
            }
            setIsLoading(true);
            setError(null);
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
    }, [artistName, setAlbums]);

    const debouncedSearch = useMemo(
        () => debounce(fetchResults, 500),
        [fetchResults]
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    return (
        <VStack gap={4} align="stretch" w="100%">
            <HStack gap={3}>
                <Input
                    placeholder={`Search for a artist name...`}
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