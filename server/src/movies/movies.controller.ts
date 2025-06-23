import { Controller, Get, Query, Param, Logger } from '@nestjs/common';
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

  @Get(':id')
  async getMovieById(@Param('id') id: string) {
    try {
      const movie = await this.moviesService.getMovieById(id);
      return movie;
    } catch (error) {
      this.logger.error(`Error fetching movie details for id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id/trailers')
  async getMovieTrailers(@Param('id') id: string) {
    try {
      const trailers = await this.moviesService.getMovieTrailers(id);
      return trailers;
    } catch (error) {
      this.logger.error(`Error fetching trailers for movie id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
