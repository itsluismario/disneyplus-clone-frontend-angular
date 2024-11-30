// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TMovie } from '../../interfaces/movie.interface';
import { MovieService } from '../../services/movie/movie.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent
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

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.fetchMovies();
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
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.error = 'Failed to load movies. Please try again later.';
    } finally {
      this.loading = false;
    }
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

}
