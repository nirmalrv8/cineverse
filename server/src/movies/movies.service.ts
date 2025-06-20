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

  async discoverMovies(params: Record<string, string>) {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    const baseUrl = this.configService.get<string>('TMDB_API_URL');
    const url = `${baseUrl}/discover/movie`;

    const response$ = this.httpService.get(url, {
      params: {
        api_key: apiKey,
        // ...params, // e.g., year, with_genres, etc.
      },
    });

    const response = await firstValueFrom(response$);
    return response.data;
  }
}
