'use client';

import { useEffect, useState } from 'react';
import { Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/movies/genres`)
      .then(res => res.json())
      .then(data => {
        if (data.genres && data.genres.length > 0) {
          setGenres(data.genres);
        }
      })
      .catch(error => {
        console.error('Error fetching movie genres:', error);
      });
  }, []);

  const handleGenreChange = (genreId: string) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleFindClick = () => {
    console.log('Selected Genres:', selectedGenres);
    const params = new URLSearchParams();
    if (selectedGenres.length > 0) {
      params.set('genres', selectedGenres.join(','));
    }
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FormGroup style={{ margin: '16px 0', maxHeight: 200, overflowY: 'auto', width: 1000 }}>
        {genres.map((genre: any) => (
          <FormControlLabel
            key={genre.id}
            control={
              <Checkbox
                checked={selectedGenres.includes(String(genre.id))}
                onChange={() => handleGenreChange(String(genre.id))}
              />
            }
            label={genre.name}
          />
        ))}
      </FormGroup>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 16 }}
        onClick={handleFindClick}
      >
        Find
      </Button>
    </div>
  );
}
