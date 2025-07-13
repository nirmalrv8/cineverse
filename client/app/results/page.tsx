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
    Promise.all([
      fetch(`${BASE_URL}/movies/${movie.id}`).then(res => res.json()),
      fetch(`${BASE_URL}/movies/${movie.id}/trailers`).then(res => res.json())
    ]).then(([movieDetails, trailers]) => {
      setSelectedMovie(movieDetails);
      const trailer = trailers.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
      setTrailerKey(trailer ? trailer.key : null);
    });
  };

  const handleClose = () => {
    setSelectedMovie(null);
    setTrailerKey(null);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* movie restult list grid */}
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

      {/* movie details dialog */}
      <Dialog
        open={!!selectedMovie}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: 500,
            maxHeight: '90vh',
            backgroundColor: selectedMovie?.backdrop_path
              ? 'rgba(20, 20, 30, 0.98)'
              : '#000',
          }
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 0, minHeight: 400 }}>
          <IconButton onClick={handleClose} sx={{ color: '#fff', position: 'absolute', right: 8, top: 8, zIndex: 2 }}>
            <CloseIcon />
          </IconButton>
          {/* movie poster and details */}
          {selectedMovie && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                width: '100%',
                minHeight: 600,
                height: '100%',
                backgroundImage: selectedMovie?.backdrop_path
                  ? `linear-gradient(to right, rgb(22, 21, 21) calc(-510px + 50vw), rgba(31, 24, 46, 0.84) 50%, rgba(42, 34, 58, 0.84) 100%), url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: 8,
                overflow: 'hidden',
                padding: 0,
              }}
            >
              {/* movie poster */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40%',
                padding: 24,
              }}>
                <img
                  style={{ width: 300, height: 400, objectFit: 'cover', borderRadius: 8 }}
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                />
              </div>

              {/* movie details */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'transparent',
                  padding: 16,
                  position: 'relative',
                  minHeight: 300,
                  width: '100%',
                  marginTop: '10%',
                  marginRight: '10%',
                }}
              >
                <h2
                  style={{
                    color: '#fff',
                    fontSize: '40px',
                    position: 'relative',
                    zIndex: 1,
                    margin: 0,
                  }}
                >
                  {selectedMovie.title} ({new Date(selectedMovie.release_date).getFullYear()})
                </h2>

                <div
                  style={{
                    color: '#fff',
                    position: 'relative',
                    zIndex: 1,
                    marginBottom: 12,
                    fontSize: '18px',
                  }}
                >
                  {(() => {
                    // Format date as M/D/YYYY
                    const date = new Date(selectedMovie.release_date);
                    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                    // Get country (if available)
                    const country = selectedMovie.production_countries && selectedMovie.production_countries.length > 0
                      ? selectedMovie.production_countries[0].iso_3166_1
                      : '';
                    // Format runtime as 1h 46m
                    const hours = Math.floor(selectedMovie.runtime / 60);
                    const minutes = selectedMovie.runtime % 60;
                    const formattedRuntime = `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
                    // Genres
                    const genres: string = selectedMovie.genres.map((g: { name: string }) => g.name).join(', ');
                    // Compose sections
                    const sections = [
                      `${formattedDate}${country ? ' (' + country + ')' : ''}`,
                      genres,
                      formattedRuntime
                    ];
                    return (
                      <span>
                        {sections.map((section, idx) => (
                          <span key={idx}>
                            {section}
                            {idx < sections.length - 1 && (
                              <span className="after:text-lg after:leading-none after:mx-2 after:my-0 lg:after:content-['•']"> </span>
                            )}
                          </span>
                        ))}
                      </span>
                    );
                  })()}
                </div>

                <div
                  style={{
                    fontStyle: 'italic',
                    fontSize: '18px',
                    color: '#fff',
                    position: 'relative',
                    zIndex: 1,
                    marginBottom: 8,
                  }}
                >
                  {selectedMovie.tagline}
                </div>

                <div
                  style={{
                    fontSize: '18px',
                    color: '#fff',
                    position: 'relative',
                    zIndex: 1,
                    marginBottom: 12,
                  }}
                >
                  Rating: {selectedMovie.vote_average} ({selectedMovie.vote_count} votes)
                </div>

                <div
                  style={{
                    fontSize: '18px',
                    color: '#fff',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {selectedMovie.overview}
                </div>
              </div>
            </div>
          )}
          {/* {trailerKey && (
            <Box width="100%" maxWidth={600}>
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
          )} */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
