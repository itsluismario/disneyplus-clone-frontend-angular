// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TMovie, TPaginatedMovieResponse } from '../../interfaces/movie.interface';
import { MovieService } from '../../services/movie/movie.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SearchComponent } from '../../components/search/search.component';
import { FavoritesService } from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    SearchComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  movies: TMovie[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 0;
  visiblePages: number[] = []; // Add this line


  favoriteStates = new Map<number, boolean>();

  constructor(
    private movieService: MovieService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.fetchMovies();
    // Subscribe to favorites changes
    this.favoritesService.favorites$.subscribe(() => {
      // Update favorite states for current movies
      this.updateFavoriteStates();
    });
  }

  onPageChange(page: number) {
    this.fetchMovies(page);
  }


  retryFetch() {
    this.fetchMovies(1);
  }

  extractYear(dateString: string): string {
    try {
      return new Date(dateString).getFullYear().toString();
    } catch {
      return 'TBA';
    }
  }

  updateVisiblePages() {
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, this.currentPage - halfVisible);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

    if (end === this.totalPages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    this.visiblePages = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  }
  async fetchMovies(page = this.currentPage) {
    try {
      this.loading = true;
      this.error = null;

      const response = await this.movieService.getAllMovies(page);

      if (response) {
        this.movies = response.results;
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.updateFavoriteStates(); // Update favorite states for new movies
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.error = 'Failed to load movies. Please try again later.';
    } finally {
      this.loading = false;
    }
  }

  private async updateFavoriteStates() {
    for (const movie of this.movies) {
      const isFavorite = await this.favoritesService.isFavorite(movie.id);
      this.favoriteStates.set(movie.id, isFavorite);
    }
  }

  isFavorite(movieId: number): boolean {
    return this.favoriteStates.get(movieId) || false;
  }

  async toggleFavorite(movie: TMovie) {
    await this.favoritesService.toggleFavorite(movie);
    const newState = await this.favoritesService.isFavorite(movie.id);
    this.favoriteStates.set(movie.id, newState);
  }

  // ... other methods remain the same

  handleSearchResults(results: TPaginatedMovieResponse | null) {
    if (!results) {
      this.fetchMovies(1);
      return;
    }

    this.movies = results.results;
    this.totalPages = results.total_pages;
    this.currentPage = results.page;
    this.updateVisiblePages();
    this.updateFavoriteStates(); // Update favorite states for search results
  }
}
