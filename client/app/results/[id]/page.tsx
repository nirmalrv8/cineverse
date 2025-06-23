"use client";

import { useParams } from "next/navigation";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { useEffect, useState } from "react";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id, BASE_URL]);

  if (!movie) return <div>Loading...</div>;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      <Card sx={{ width: 350 }}>
        <CardMedia
          component="img"
          height="500"
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {movie.overview}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Release Date: {movie.release_date}
          </Typography>
        </CardContent>
      </Card>
      {/* Trailer section can be added here if available */}
    </Box>
  );
}
