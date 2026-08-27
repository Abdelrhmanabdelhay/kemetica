import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { NotificationService } from './core/services/notification.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly notificationService = inject(NotificationService);
  readonly loadingService = inject(LoadingService);
  private router = inject(Router);

  constructor() {
    // Fallback: If no API calls are made, ensure initial loader stops after navigation finishes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        // Wait a short bit to see if any API calls were triggered by the new route
        setTimeout(() => {
          this.loadingService.forceStopInitialLoader();
        }, 800);
      }
    });
  }
}
