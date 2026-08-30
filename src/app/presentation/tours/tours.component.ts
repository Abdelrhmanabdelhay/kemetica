import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GetToursUseCase } from '../../domain/use-cases/get-tours.usecase';
import { Tour } from '../../domain/models/tour.model';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { GetDestinationsUseCase } from '../../domain/use-cases/get-destinations.usecase';
import { GetSpecialToursUseCase } from '../../domain/use-cases/get-special-tours.usecase';
import { Destination } from '../../domain/models/destination.model';
import { GetFeaturedToursUseCase } from '../../domain/use-cases/get-featured-tours.usecase';
import { GetPopularToursUseCase } from '../../domain/use-cases/get-popular-tours.usecase';
import { environment } from '../../../environments/environment';
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
  private readonly getSpecialTours = inject(GetSpecialToursUseCase);
  private readonly getDestinations = inject(GetDestinationsUseCase);
  private readonly getFeaturedTours = inject(GetFeaturedToursUseCase);
  private readonly getPopularTours = inject(GetPopularToursUseCase);
  readonly tours = signal<Tour[]>([]);
  readonly loading = signal<boolean>(true);
  readonly featuredTours = signal<Tour[]>([]);
  readonly specialTours = signal<Tour[]>([]);
  readonly popularTours = signal<Tour[]>([]);
  readonly destinations = signal<Destination[]>([]);

  readonly selectedDestination = signal<string | null>(null);
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
      this.fetchDestinations();
      this.fetchPopularTours();
      this.fetchFeaturedTours();
    });
  }

  private fetchFeaturedTours(): void {
    this.getFeaturedTours.execute().subscribe({
      next: (tours) => this.featuredTours.set(tours),
      error: () => console.error('Failed to fetch featured tours')
    });
  }

  private fetchPopularTours(): void {
    this.getPopularTours.execute().subscribe({
      next: (tours) => this.popularTours.set(tours),
      error: () => console.error('Failed to fetch popular tours')
    });
  }

  private fetchDestinations(): void {
    this.getDestinations.execute().subscribe({
      next: (dests) => {
        this.destinations.set(dests);
        if (dests.length > 0) {
          this.selectDestination(dests[0].slug);
        } else {
          this.loading.set(false);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  selectDestination(slug: string): void {
    this.selectedDestination.set(slug);
    this.loading.set(true);
    this.getSpecialTours.execute(slug).subscribe({
      next: (tours) => {
        this.specialTours.set(tours);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getSelectedDestinationToursCount(): number {
    const selected = this.selectedDestination();
    if (!selected) return 0;
    const dest = this.destinations().find(d => d.slug === selected);
    return dest ? (dest.toursCount || 0) : 0;
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

  getDestinationAsTour(dest: Destination): Tour {
    return {
      title: dest.name,
      city: dest.name,
      featuredImage: `https://management-squeaky-fish.abasthan.app/cover-special/${dest.slug}.jpg`,
    } as Tour;
  }
}
