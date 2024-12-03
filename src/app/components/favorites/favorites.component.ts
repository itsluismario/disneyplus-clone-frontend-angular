// favorites.component.ts
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { TMovie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  favorites: TMovie[] = [];
  isLoading = true;
  private subscription: Subscription = new Subscription();

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.loadFavorites();
    this.subscription.add(
      this.favoritesService.favorites$.subscribe(
        favorites => {
          this.favorites = favorites;
          this.isLoading = false;
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async loadFavorites() {
    try {
      await this.favoritesService.getFavorites();
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async removeFromFavorites(movie: TMovie) {
    try {
      await this.favoritesService.toggleFavorite(movie);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }
}
