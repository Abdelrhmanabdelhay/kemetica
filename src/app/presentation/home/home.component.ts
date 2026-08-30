import { Component, OnInit, AfterViewInit, OnDestroy, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GetFeaturedToursUseCase } from '../../domain/use-cases/get-featured-tours.usecase';
import { GetSpecialToursUseCase } from '../../domain/use-cases/get-special-tours.usecase';
import { GetDestinationsUseCase } from '../../domain/use-cases/get-destinations.usecase';
import { GetPopularToursUseCase } from '../../domain/use-cases/get-popular-tours.usecase';
import { Tour } from '../../domain/models/tour.model';
import { Destination } from '../../domain/models/destination.model';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { PopularTourCardComponent } from '../../shared/components/popular-tour-card/popular-tour-card.component';
import { LoadingService } from '../../core/services/loading.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TourCardComponent, PopularTourCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  private readonly getFeaturedTours = inject(GetFeaturedToursUseCase);
  private readonly getSpecialTours = inject(GetSpecialToursUseCase);
  private readonly getDestinations = inject(GetDestinationsUseCase);
  private readonly getPopularTours = inject(GetPopularToursUseCase);
  readonly loadingService = inject(LoadingService);

  private videoLoadHandled = false;

  constructor() {
    // Add a manual loading task so the global loader stays until the video is ready
    this.loadingService.show();
  }

  readonly featuredTours = signal<Tour[]>([]);
  readonly specialTours = signal<Tour[]>([]);
  readonly popularTours = signal<Tour[]>([]);
  readonly destinations = signal<Destination[]>([]);
  readonly selectedDestination = signal<string | null>(null);

  readonly isVideoReady = signal<boolean>(false);

  ngOnDestroy() {
    // Clean up loading state if user navigates away before video loads
    if (!this.videoLoadHandled) {
      this.videoLoadHandled = true;
      this.loadingService.hide();
    }
  }

  onVideoReady() {
    if (!this.videoLoadHandled) {
      this.videoLoadHandled = true;
      this.isVideoReady.set(true);
      // Remove our manual loading task
      this.loadingService.hide();
    }
  }

  readonly loading = signal<boolean>(true);

  readonly stats = [
    { value: '2018', label: 'Founded in Aswan, Egypt' },
    { value: '100%', label: 'Private Egyptologist Curators' },
    { value: '4.98', label: 'Guest Excellence Rating' },
    { value: '500+', label: 'Protected Tomb VIP Approvals' },
  ];

  readonly features = [
    {
      icon: '🏛️',
      title: 'Private After-Hours Access',
      desc: 'Step into Khufus pyramid and royal burial grounds in complete solitude without public crowds.',
    },
    {
      icon: '⛵',
      title: 'Bespoke Dahabiya Yachts',
      desc: 'Sail the Nile aboard hand-crafted wooden Dahabiyas with private chefs and master scholars.',
    },
    {
      icon: '💎',
      title: 'White-Glove Concierge',
      desc: 'Direct tarmac escort, five-star heritage hotels, and armored private luxury vehicle transfers.',
    },
  ];

  ngOnInit(): void {
    this.fetchDestinations();
    this.fetchPopularTours();
    this.fetchFeaturedTours();
  }

  ngAfterViewInit() {
    const vid = this.bgVideo?.nativeElement;
    if (vid) {
      vid.muted = true;
      vid.play().catch(() => {
        // If autoplay is blocked by the browser, dismiss the loader anyway
        this.onVideoReady();
      });
    }

    // Safety fallback: if the video doesn't emit 'playing' within 5 seconds, hide the loader
    setTimeout(() => {
      this.onVideoReady();
    }, 5000);
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

  trackByIndex(index: number, item: any): number {
    return index;
  }

  getDestinationAsTour(dest: Destination): Tour {
    return {
      title: dest.name,
      city: dest.name,
      featuredImage: `https://management-squeaky-fish.abasthan.app/cover-special/${dest.slug}.jpg`,
    } as Tour;
  }
}
