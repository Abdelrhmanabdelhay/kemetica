import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GetFeaturedToursUseCase } from '../../domain/use-cases/get-featured-tours.usecase';
import { Tour } from '../../domain/models/tour.model';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TourCardComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly getFeaturedTours = inject(GetFeaturedToursUseCase);
  
  readonly featuredTours = signal<Tour[]>([]);
  readonly loading = signal<boolean>(true);

  readonly stats = [
    { value: '25+', label: 'Years of Royal Heritage Expeditions' },
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
    this.getFeaturedTours.execute().subscribe({
      next: (tours) => {
        this.featuredTours.set(tours);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
