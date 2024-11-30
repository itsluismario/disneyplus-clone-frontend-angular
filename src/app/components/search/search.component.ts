// search.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MovieService } from '../../services/movie/movie.service';
import { TMovie, TPaginatedMovieResponse } from '../../interfaces/movie.interface';

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

  constructor(private movieService: MovieService) {
    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(10), // Wait 300ms after user stops typing
      distinctUntilChanged() // Only emit if value changed
    ).subscribe((query) => {
      this.performSearch(query);
    });
  }

  onSearchInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
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
      this.searchResults.emit(response);
    } catch (error) {
      this.error = 'Failed to search movies. Please try again.';
      console.error('Search error:', error);
    } finally {
      this.loading = false;
    }
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
}
