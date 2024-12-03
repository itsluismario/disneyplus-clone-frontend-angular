// search.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MovieService } from '../../services/movie/movie.service';
import { TMovie, TPaginatedMovieResponse } from '../../interfaces/movie.interface';
import { FavoritesService } from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  @Output() searchResults = new EventEmitter<TPaginatedMovieResponse | null>();

  searchQuery = '';
  loading = false;
  error: string | null = null;
  movies: TMovie[] = [];
  private searchSubject = new Subject<string>();


  favoriteStates = new Map<number, boolean>();

  constructor(private movieService: MovieService, private favoritesService: FavoritesService) {
    // Existing search subject setup remains the same
    this.searchSubject.pipe(
      debounceTime(10),
      distinctUntilChanged()
    ).subscribe((query) => {
      this.performSearch(query);
    });
  }

  ngOnInit() {
    // Subscribe to favorites changes
    this.favoritesService.favorites$.subscribe(() => {
      // Update favorite states for current movies
      this.updateFavoriteStates();
    });
  }

  onSearchInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

   // Add this method
   extractYear(dateString: string): string {
    try {
      return new Date(dateString).getFullYear().toString();
    } catch {
      return 'TBA';
    }
  }

  resetToHome() {
    this.searchQuery = '';
    this.movies = [];
    this.searchResults.emit(null);
  }

  async performSearch(query: string) {
    if (!query.trim()) {
      this.searchResults.emit(null);
      this.movies = [];
      return;
    }

    try {
      this.loading = true;
      this.error = null;
      const response = await this.movieService.searchMovies(query);
      this.movies = response.results;
      this.updateFavoriteStates(); // Update favorite states for new movies
      this.searchResults.emit(response);
    } catch (error) {
      this.error = 'Failed to search movies. Please try again.';
      console.error('Search error:', error);
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
}
