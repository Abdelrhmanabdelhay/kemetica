import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GetToursUseCase } from '../../domain/use-cases/get-tours.usecase';
import { Tour } from '../../domain/models/tour.model';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [CommonModule, FormsModule, TourCardComponent],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.scss',
})
export class ToursComponent implements OnInit {
  private readonly getToursUseCase = inject(GetToursUseCase);
  private readonly route = inject(ActivatedRoute);

  readonly tours = signal<Tour[]>([]);
  readonly loading = signal<boolean>(true);

  selectedCategory = 'all';
  searchQuery = '';

  readonly categories = [
    { id: 'all', label: 'All Expeditions' },
    { id: 'historical', label: 'Pyramids & Antiquities' },
    { id: 'luxury-nile', label: 'Nile Dahabiya' },
    { id: 'desert-safari', label: 'Desert Odyssey' },
    { id: 'diving', label: 'Red Sea Safari' },
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      this.fetchTours();
    });
  }

  fetchTours(): void {
    this.loading.set(true);
    this.getToursUseCase
      .execute({
        category: this.selectedCategory,
        searchQuery: this.searchQuery,
      })
      .subscribe({
        next: (items) => {
          this.tours.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onCategoryChange(catId: string): void {
    this.selectedCategory = catId;
    this.fetchTours();
  }

  onSearch(): void {
    this.fetchTours();
  }
}
