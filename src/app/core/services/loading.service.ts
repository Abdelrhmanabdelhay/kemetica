import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Track if this is the first initial load of the application
  readonly isInitialLoading = signal<boolean>(true);
  
  // Track if any background HTTP requests are active
  readonly isLoading = signal<boolean>(false);

  private activeRequests = 0;
  private hasFinishedInitialLoad = false;

  show() {
    this.activeRequests++;
    this.isLoading.set(true);
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.isLoading.set(false);
      
      // The very first time all requests finish, we turn off the initial loader
      if (!this.hasFinishedInitialLoad) {
        this.hasFinishedInitialLoad = true;
        // Small delay to prevent flashing if requests are too fast
        setTimeout(() => {
          this.isInitialLoading.set(false);
        }, 300);
      }
    }
  }

  // A safety mechanism in case no initial API calls are made on some routes
  forceStopInitialLoader() {
    if (!this.hasFinishedInitialLoad) {
      this.hasFinishedInitialLoad = true;
      this.isInitialLoading.set(false);
      this.isLoading.set(false);
    }
  }
}
