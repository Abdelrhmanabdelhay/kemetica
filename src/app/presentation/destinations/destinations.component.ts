import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GetToursUseCase } from '../../domain/use-cases/get-tours.usecase';
import { GetSpecialToursUseCase } from '../../domain/use-cases/get-special-tours.usecase';
import { Tour } from '../../domain/models/tour.model';
import { PopularTourCardComponent } from '../../shared/components/popular-tour-card/popular-tour-card.component';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, RouterLink, PopularTourCardComponent],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.scss',
})
export class DestinationsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly getTours = inject(GetToursUseCase);
  private readonly getSpecialTours = inject(GetSpecialToursUseCase);

  readonly destination = signal<string>('');
  readonly coverTour = signal<Tour | null>(null);
  readonly tabTours = signal<Tour[]>([]);
  readonly allTours = signal<Tour[]>([]);

  get headline(): string {
    const dest = this.destination().toLowerCase();
    switch (dest) {
      case 'giza': return 'Explore the Pyramids of Giza';
      case 'aswan': return 'Sail the Nile in Aswan';
      case 'luxor': return 'Discover Ancient Luxor';
      case 'cairo': return 'Experience Vibrant Cairo';
      case 'alexandria': return 'Uncover Coastal Alexandria';
      default: return `Explore ${this.destination()}`;
    }
  }

  readonly loadingCover = signal<boolean>(true);
  readonly loadingTabs = signal<boolean>(true);
  readonly loadingAll = signal<boolean>(true);

  selectedSubType: 'gold' | 'cruise' | 'transfer' = 'gold';

  readonly subTypeLabels = [
    { id: 'gold', label: '🥇 Gold' },
    { id: 'cruise', label: '🚢 Cruise' },
    { id: 'transfer', label: '🚌 Popular' },
  ] as const;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const dest = params.get('destination');
      if (dest) {
        this.destination.set(dest);
        this.loadDestinationData(dest);
      }
    });
  }

  private loadDestinationData(destination: string): void {
    this.loadingCover.set(true);
    this.loadingTabs.set(true);
    this.loadingAll.set(true);

    // 1. Fetch Cover Image (Special Tour)
    this.getSpecialTours.execute(destination).subscribe({
      next: (tours) => {
        if (tours && tours.length > 0) {
          this.coverTour.set(tours[0]);
        }
        this.loadingCover.set(false);
      },
      error: () => this.loadingCover.set(false)
    });

    // 2. Fetch All Tours for this Destination
    this.getTours.execute({ destination }).subscribe({
      next: (tours) => {
        this.allTours.set(tours);
        this.loadingAll.set(false);
      },
      error: () => this.loadingAll.set(false)
    });

    // 3. Fetch Tab Tours (Default: gold)
    this.selectedSubType = 'gold';
    this.fetchTabTours();
  }

  onTabChange(subType: 'gold' | 'cruise' | 'transfer'): void {
    this.selectedSubType = subType;
    this.fetchTabTours();
  }

  private fetchTabTours(): void {
    this.loadingTabs.set(true);
    this.getTours.execute({
      destination: this.destination(),
      sub_type: this.selectedSubType
    }).subscribe({
      next: (tours) => {
        this.tabTours.set(tours);
        this.loadingTabs.set(false);
      },
      error: () => this.loadingTabs.set(false)
    });
  }
}
