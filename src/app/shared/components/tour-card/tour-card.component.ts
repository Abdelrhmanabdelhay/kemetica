import { Component, Input, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tour } from '../../../domain/models/tour.model';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-card.component.html',
  styleUrl: './tour-card.component.scss',
})
export class TourCardComponent implements OnChanges {
  @Input({ required: true }) tour!: Tour;
  @Input() toursCount?: number;

  readonly isImageLoading = signal<boolean>(true);
  readonly previousImageSrc = signal<string | null>(null);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tour'] && !changes['tour'].isFirstChange()) {
      const oldTour = changes['tour'].previousValue as Tour;
      const newTour = changes['tour'].currentValue as Tour;
      
      if (oldTour && oldTour.featuredImage !== newTour.featuredImage) {
        // Keep the old image visible while the new one loads
        this.previousImageSrc.set(oldTour.featuredImage);
        this.isImageLoading.set(true);
      }
    }
  }

  onImageLoaded() {
    this.isImageLoading.set(false);
    // Remove the old image from DOM after the crossfade transition completes
    setTimeout(() => {
      this.previousImageSrc.set(null);
    }, 700);
  }
}
