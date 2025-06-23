"use client";

import { useParams } from "next/navigation";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { useEffect, useState } from "react";

export default function MovieDetailsPage() {
  const { id } = useParams();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [movie, setMovie] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/movies/${id}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
    // Fetch trailer from backend (expects /movies/:id/videos endpoint)
    fetch(`${BASE_URL}/movies/${id}/trailers`)
      .then((res) => res.json())
      .then((data) => {
        // data is an array, not an object with results
        const trailer = data.find(
          (v: any) => v.site === "YouTube" && v.type === "Trailer"
        );
        setTrailerKey(trailer ? trailer.key : null);
      });
  }, [id, BASE_URL]);

  if (!movie) return <div>Loading...</div>;

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="flex-start"
      justifyContent="center"
      p={4}
      gap={4}
    >
      <Card sx={{ width: 350, flexShrink: 0 }}>
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
      {trailerKey && (
        <Box width="100%" maxWidth={600}>
          <Typography variant="h6" gutterBottom>
            Trailer
          </Typography>
          <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="YouTube trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
