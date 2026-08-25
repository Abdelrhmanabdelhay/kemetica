import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tour } from '../../../domain/models/tour.model';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-card.component.html',
  styleUrl: './tour-card.component.scss',
})
export class TourCardComponent {
  @Input({ required: true }) tour!: Tour;
  @Input() toursCount?: number;
}
