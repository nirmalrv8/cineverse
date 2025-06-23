'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

export default function ResultsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 10; // 10px from the bottom
      if (scrollPosition >= threshold && hasMore) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchParams]);

  useEffect(() => {
    if (!hasMore) return;
    const genres = searchParams.get('genres');
    fetch(`${BASE_URL}/movies/suggest${genres ? `?genres=${genres}` : ''}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        setMovies(prev => [...prev, ...(data.results || [])]);
        setHasMore(page < data.total_pages);
      });
  }, [page]);

  const handleCardClick = (movie: any) => {
    setSelectedMovie(movie);
    fetch(`${BASE_URL}/movies/${movie.id}/trailers`)
      .then(res => res.json())
      .then(data => {
        const trailer = data.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
        setTrailerKey(trailer ? trailer.key : null);
      });
  };

  const handleClose = () => {
    setSelectedMovie(null);
    setTrailerKey(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Grid container spacing={3} justifyContent="center">
        {movies.map((movie: any) => (
          <Grid component="div" key={movie.id} sx={{ width: 200 }}>
            <Card sx={{ cursor: 'pointer' }} onClick={() => handleCardClick(movie)}>
              {movie.poster_path && (
                <CardMedia
                  component="img"
                  height="350"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6" component="div">
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.release_date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={!!selectedMovie} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
            <CloseIcon />
          </IconButton>
          {selectedMovie && (
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="flex-start" gap={4} p={4}>
              <Card sx={{ width: 350, flexShrink: 0 }}>
                <CardMedia
                  component="img"
                  height="500"
                  image={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h4" component="div" gutterBottom>
                    {selectedMovie.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {selectedMovie.overview}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Release Date: {selectedMovie.release_date}
                  </Typography>
                </CardContent>
              </Card>
              {trailerKey && (
                <Box width="100%" maxWidth={600}>
                  <Typography variant="h6" gutterBottom>
                    Trailer
                  </Typography>
                  <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${trailerKey}`}
                      title="YouTube trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
