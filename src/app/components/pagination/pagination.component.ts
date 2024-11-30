// src/app/components/movie-pagination/movie-pagination.component.ts
// src/app/components/pagination/pagination.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HlmPaginationContentDirective,
  HlmPaginationDirective,
  HlmPaginationEllipsisComponent,
  HlmPaginationItemDirective,
  HlmPaginationLinkDirective,
  HlmPaginationNextComponent,
  HlmPaginationPreviousComponent,
} from '@spartan-ng/ui-pagination-helm';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
    HlmPaginationDirective,
    HlmPaginationContentDirective,
    HlmPaginationEllipsisComponent,
    HlmPaginationItemDirective,
    HlmPaginationLinkDirective,
    HlmPaginationNextComponent,
    HlmPaginationPreviousComponent,
  ],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 0;
  @Output() pageChange = new EventEmitter<number>();

  visiblePages: number[] = [];

  ngOnChanges() {
    this.updateVisiblePages();
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

  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.pageChange.emit(page);
  }
}
