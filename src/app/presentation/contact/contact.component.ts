import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly notificationService = inject(NotificationService);

  formData = {
    fullName: '',
    email: '',
    phone: '',
    expeditionType: 'luxury-nile',
    estimatedGuests: 2,
    travelDates: '',
    specialRequests: '',
  };

  isSubmitting = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  onSubmit(): void {
    if (!this.formData.fullName || !this.formData.email) {
      this.notificationService.showError('Please provide your name and email address.');
      return;
    }

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubmitted.set(true);
      this.notificationService.showSuccess('Your private inquiry has been received by our senior concierge.');
    }, 1000);
  }
}
