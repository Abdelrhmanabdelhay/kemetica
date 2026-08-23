import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tour } from '../../../domain/models/tour.model';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyFormatPipe, TruncatePipe],
  templateUrl: './tour-card.component.html',
  styleUrl: './tour-card.component.scss',
})
export class TourCardComponent {
  @Input({ required: true }) tour!: Tour;
}
