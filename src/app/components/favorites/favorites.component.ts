// favorites.component.ts
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { TMovie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  favorites: TMovie[] = [];

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit() {
    this.favoritesService.favorites$.subscribe(
      favorites => {
        this.favorites = favorites;
      }
    );
  }

  removeFromFavorites(movie: TMovie) {
    this.favoritesService.toggleFavorite(movie);
  }

}
