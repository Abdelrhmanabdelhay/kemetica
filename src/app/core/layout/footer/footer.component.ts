import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
  newsletterEmail = '';
  newsletterSubscribed = signal<boolean>(false);

  subscribeNewsletter(): void {
    if (this.newsletterEmail.trim()) {
      this.newsletterSubscribed.set(true);
      this.newsletterEmail = '';
    }
  }
}
