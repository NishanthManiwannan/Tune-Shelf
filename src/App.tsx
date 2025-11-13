import React, { Suspense } from 'react';
import './App.css'
import { Button, Center, Container, Heading, HStack, Spinner, Text, VStack } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';

const MainScreen = React.lazy(() => import('./components/MainScreen'));
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import AlbumDetailWrapper from './components/AlbumDetailWrapper';
import FavouritesPage from './components/AlbumFav/FavouritesPage';
import TrackListGraph from './components/Graph/TrackListGraph';

const LoadingFallback: React.FC = () => (
  <Center height="300px">
    <VStack gap={4}>
      <Spinner size="xl" color="purple.500" />
      <Text>Loading application chunk...</Text>
    </VStack>
  </Center>
);

const NavBar: React.FC = () => (
  <HStack gap={4} p={4} borderBottom="1px">
    <RouterLink to="/">
      <Button variant="solid">Home</Button>
    </RouterLink>
    <RouterLink to="/favourites">
      <Button variant="ghost">Favourites</Button>
    </RouterLink>
    <RouterLink to="/most-played">
      <Button variant="ghost">Most Played</Button>
    </RouterLink>
  </HStack>
);

function App() {
  return (
    <ErrorBoundary errorComponent={<div>Something went wrong. Please try again later.</div>}>
      <BrowserRouter>
        <Container maxW="container.xl">
          <NavBar />
          <Heading as="h1" mb={6}>Tune Shelf</Heading>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<MainScreen />} />
              <Route path="/album/:artist/:album" element={<AlbumDetailWrapper />} />
              <Route path="/favourites" element={<FavouritesPage />} />
              <Route path="/most-played" element={<TrackListGraph />} />
              <Route path="*" element={<Text>Page Not Found</Text>} />
            </Routes>
          </Suspense>
        </Container>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
