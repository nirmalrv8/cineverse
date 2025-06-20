'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

export default function ResultsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [movies, setMovies] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const genres = searchParams.get('genres');
    fetch(`${BASE_URL}/movies/suggest${genres ? `?genres=${genres}` : ''}`)
      .then(res => res.json())
      .then(data => setMovies(data.results || []));
  }, [searchParams]);

  return (
    <div style={{ padding: 24 }}>
      <Grid container spacing={3} justifyContent="center">
        {movies.map((movie: any) => (
          <Grid item key={movie.id} sx={{ width: 200 }}>
            <Card>
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
    </div>
  );
}
