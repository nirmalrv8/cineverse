'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

export default function ResultsPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const loader = useRef<HTMLDivElement | null>(null);

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

  return (
    <div style={{ padding: 24 }}>
      <Grid container spacing={3} justifyContent="center">
        {movies.map((movie: any) => (
          <Grid component="div" key={movie.id} sx={{ width: 200 }}>
            <Link href={`/results/${movie.id}`} style={{ textDecoration: 'none' }}>
              <Card sx={{ cursor: 'pointer' }}>
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
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
