import { Controller, Get, Query, Logger } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  @Get('genres')
  async getGenres() {
    try {
      const genres = await this.moviesService.getGenres();
      return genres;
    } catch (error) {
      this.logger.error(`Error fetching movie genres: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get('suggest')
  async getSuggestions(@Query() filters: any) {
    try {
      const suggestions = await this.moviesService.discoverMovies(filters);
      return suggestions;
    } catch (error) {
      this.logger.error(`Error fetching movie suggestions: ${error.message}`, error.stack);
      throw error;
    }
  }
}
