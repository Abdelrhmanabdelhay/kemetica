import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly themeService = inject(ThemeService);
  readonly isMobileMenuOpen = signal<boolean>(false);

  readonly navItems = [
    { label: 'Home', path: '/' },
    { label: 'Destinations', path: '/tours' },
    { label: 'Transportation', path: '/tours', queryParams: { category: 'luxury-nile' } },
    { label: 'About Us', path: '/' },
    { label: 'Contact', path: '/contact' },
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
