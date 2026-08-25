import { Component, inject, signal, HostListener, OnInit } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  readonly themeService = inject(ThemeService);
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isScrolled = signal<boolean>(false);

  readonly navItems = [
    { label: 'Home', path: '/' },
    { label: 'Destinations', path: '/tours' },
    { label: 'Transportation', path: '/tours', queryParams: { category: 'luxury-nile' } },
    { label: 'About Us', path: '/' },
    { label: 'Contact', path: '/contact' },
  ];

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }

  private checkScroll() {
    // If scrolled more than 50px, consider it scrolled
    if (window.scrollY > 100) {
      this.isScrolled.set(true);
    } else {
      this.isScrolled.set(false);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
