import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tour } from '../../../domain/models/tour.model';

@Component({
  selector: 'app-popular-tour-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './popular-tour-card.component.html',
  styleUrl: './popular-tour-card.component.scss',
})
export class PopularTourCardComponent {
  @Input({ required: true }) tour!: Tour;
}
