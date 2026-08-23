import { Injectable, signal } from '@angular/core';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly notifications = signal<ToastNotification[]>([]);

  showSuccess(message: string): void {
    this.addNotification('success', message);
  }

  showError(message: string): void {
    this.addNotification('error', message);
  }

  showInfo(message: string): void {
    this.addNotification('info', message);
  }

  private addNotification(type: ToastNotification['type'], message: string): void {
    const id = Math.random().toString(36).substring(2, 9);
    this.notifications.update((items) => [...items, { id, type, message }]);

    setTimeout(() => {
      this.dismiss(id);
    }, 4000);
  }

  dismiss(id: string): void {
    this.notifications.update((items) => items.filter((n) => n.id !== id));
  }
}
