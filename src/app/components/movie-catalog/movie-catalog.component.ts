// movie-catalog.components.ts

import { Component, OnInit, HostListener } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../interfaces/movie.interface';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-movie-catalog',
  templateUrl: './movie-catalog.component.html',
  styleUrls: ['./movie-catalog.component.scss']
})
export class MovieCatalogComponent implements OnInit {
  movies: Movie[] = [];
  favoriteMovies: Movie[] = [];
  currentPage = 1;
  loading = false;
  searchQuery = '';
  private searchSubject = new Subject<string>();

  constructor(private movieService: MovieService) {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.searchQuery = query;
        this.currentPage = 1;
        this.loadMovies();
      });
  }

  ngOnInit(): void {
    this.loadMovies();
    this.loadFavorites();
  }

  onSearch(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  loadMovies(): void {
    this.loading = true;
    this.movieService.getMovies(this.currentPage, this.searchQuery)
      .subscribe(
        response => {
          if (this.currentPage === 1) {
            this.movies = response.results;
          } else {
            this.movies = [...this.movies, ...response.results];
          }
          this.loading = false;
        },
        error => {
          console.error('Error loading movies:', error);
          this.loading = false;
        }
      );
  }

  loadMore(): void {
    this.currentPage++;
    this.loadMovies();
  }

  loadFavorites(): void {
    this.movieService.getFavorites().subscribe(
      favorites => this.favoriteMovies = favorites
    );
  }

  toggleFavorite(movie: Movie): void {
    this.movieService.toggleFavorite(movie);
  }

  isFavorite(movieId: number): boolean {
    return this.movieService.isFavorite(movieId);
  }
}
