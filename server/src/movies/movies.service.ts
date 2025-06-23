import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getGenres() {
    try {
      const apiKey = this.configService.get<string>('TMDB_API_KEY');
      const baseUrl = this.configService.get<string>('TMDB_API_URL');
      const url = `${baseUrl}/genre/movie/list`;

      const response$ = this.httpService.get(url, {
        params: {
          api_key: apiKey,
        },
      });

      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async discoverMovies(filters: Record<string, string | number>) {
    try {
      const apiKey = this.configService.get<string>('TMDB_API_KEY');
      const baseUrl = this.configService.get<string>('TMDB_API_URL');
      const url = `${baseUrl}/discover/movie`;

      const response$ = this.httpService.get(url, {
        params: {
          api_key: apiKey,
          with_genres: filters.genres,
          page: filters.page || 1,
          sort_by: 'popularity.desc',
        },
      });

      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMovieById(id: string) {
    try {
      const apiKey = this.configService.get<string>('TMDB_API_KEY');
      const baseUrl = this.configService.get<string>('TMDB_API_URL');
      const url = `${baseUrl}/movie/${id}`;
      const response$ = this.httpService.get(url, {
        params: {
          api_key: apiKey,
        },
      });
      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMovieTrailers(id: string) {
    try {
      const apiKey = this.configService.get<string>('TMDB_API_KEY');
      const baseUrl = this.configService.get<string>('TMDB_API_URL');
      const url = `${baseUrl}/movie/${id}/videos`;
      const response$ = this.httpService.get(url, {
        params: {
          api_key: apiKey,
        },
      });
      const response = await firstValueFrom(response$);
      // Filter for trailers only
      const trailers = response.data.results?.filter((video: any) => video.type === 'Trailer');
      return trailers;
    } catch (error) {
      throw new Error(error);
    }
  }
}
