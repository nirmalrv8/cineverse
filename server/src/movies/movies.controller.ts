import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('suggest')
  async getSuggestions(@Query() filters: any) {
    return this.moviesService.discoverMovies(filters);
  }
}
