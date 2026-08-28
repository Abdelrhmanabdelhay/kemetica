import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../../../data/services/admin-api.service';
import { TourApiService } from '../../../../data/services/tour-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-tours',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tr-page">
      <!-- Header -->
      <div class="tr-header">
        <div>
          <h1 class="tr-title">Tours</h1>
          <p class="tr-subtitle">Manage expedition packages available on the platform.</p>
        </div>
        <button class="tr-add-btn" (click)="toggleForm()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Tour
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="tr-loading">
        <div class="tr-spinner"></div>
        <p>Loading tours...</p>
      </div>

      <!-- Filter Bar -->
      <div class="tr-filter-bar" *ngIf="!isLoading() && tours().length > 0">
        <span class="tr-filter-label">Filter by Destination:</span>
        <button class="tr-filter-btn" [class.active]="selectedFilter() === 'all'" (click)="selectedFilter.set('all')">All</button>
        <button class="tr-filter-btn" [class.active]="selectedFilter() === 'giza'" (click)="selectedFilter.set('giza')">Giza</button>
        <button class="tr-filter-btn" [class.active]="selectedFilter() === 'luxor'" (click)="selectedFilter.set('luxor')">Luxor</button>
        <button class="tr-filter-btn" [class.active]="selectedFilter() === 'aswan'" (click)="selectedFilter.set('aswan')">Aswan</button>
      </div>

      <!-- Table -->
      <div *ngIf="!isLoading()" class="tr-table-wrap">
        <table class="tr-table">
          <thead>
            <tr>
              <th>Tour</th>
              <th>Destination</th>
              <th>Duration</th>
              <th>Group Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tour of filteredTours(); let i = index" class="tr-row" [style.animation-delay]="(i * 0.05) + 's'">
              <td>
                <div class="tr-tour-cell">
                  <div class="tr-tour-img">
                    <img *ngIf="tour.featured_image_url" [src]="tour.featured_image_url" [alt]="tour.title" />
                    <div *ngIf="!tour.featured_image_url" class="tr-tour-img-placeholder">🗺️</div>
                  </div>
                  <div>
                    <p class="tr-tour-name">{{ tour.title }}</p>
                    <p class="tr-tour-tag">{{ tour.tagline }}</p>
                  </div>
                </div>
              </td>
              <td><span class="tr-dest-pill">{{ tour.destination | titlecase }}</span></td>
              <td>
                <div class="tr-duration">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {{ tour.duration || tour.duration_days }} {{ tour.duration_type || (tour.duration_days === 1 ? 'Day' : 'Days') }}
                </div>
              </td>
              <td>
                <div class="tr-group">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                  {{ tour.max_group_size || '—' }}
                </div>
              </td>
              <td>
                <div class="tr-action-btns">
                  <button (click)="openEditForm(tour)" class="tr-edit-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Edit
                  </button>
                  <button (click)="confirmDelete(tour._id)" class="tr-delete-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredTours().length === 0">
              <td colspan="5" class="tr-empty-row">
                <div class="tr-empty">
                  <div style="font-size:2.5rem;margin-bottom:.75rem">🗺️</div>
                  <p>No tours yet. Create your first expedition above.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="tr-modal-overlay" *ngIf="tourToDelete()">
        <div class="tr-modal-card">
          <div class="tr-modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3 class="tr-modal-title">Delete Tour?</h3>
          <p class="tr-modal-msg">Are you sure you want to permanently delete this tour? This action cannot be undone.</p>
          <div class="tr-modal-actions">
            <button class="tr-modal-cancel" (click)="cancelDelete()">Cancel</button>
            <button class="tr-modal-confirm" (click)="executeDelete()">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tr-page { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .tr-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
    .tr-title { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem; }
    .tr-subtitle { font-size: 0.9rem; color: #64748b; margin: 0; }
    .tr-add-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: #0f172a; color: #fff; border: none; border-radius: 10px;
      padding: 0.7rem 1.25rem; font-size: 0.875rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(15,23,42,0.2);
    }
    .tr-add-btn:hover { background: #1e293b; transform: translateY(-1px); }

    /* Loading & Filter */
    .tr-loading { text-align: center; padding: 4rem; color: #94a3b8; }
    .tr-spinner { width: 36px; height: 36px; border: 3px solid #f1f5f9; border-top-color: #d4af37; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    
    .tr-filter-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .tr-filter-label { font-size: 0.85rem; font-weight: 600; color: #64748b; margin-right: 0.5rem; }
    .tr-filter-btn {
      background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569;
      font-size: 0.8rem; font-weight: 600; padding: 0.4rem 0.875rem; border-radius: 99px;
      cursor: pointer; transition: all 0.2s;
    }
    .tr-filter-btn:hover { background: #e2e8f0; }
    .tr-filter-btn.active {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: #fff; border-color: #0f172a;
    }

    /* Table */
    .tr-table-wrap { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .tr-table { width: 100%; border-collapse: collapse; }
    .tr-table thead th { padding: 1rem 1.25rem; text-align: left; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .tr-row { border-bottom: 1px solid #f1f5f9; transition: background 0.15s; animation: rowIn 0.35s ease both; }
    @keyframes rowIn { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }
    .tr-row:last-child { border-bottom: none; }
    .tr-row:hover { background: #fafbfc; }
    .tr-table tbody td { padding: 1rem 1.25rem; vertical-align: middle; }
    .tr-tour-cell { display: flex; align-items: center; gap: 1rem; }
    .tr-tour-img { width: 52px; height: 52px; border-radius: 10px; overflow: hidden; flex-shrink: 0; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .tr-tour-img img { width: 100%; height: 100%; object-fit: cover; }
    .tr-tour-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0 0 0.2rem; }
    .tr-tour-tag { font-size: 0.75rem; color: #94a3b8; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
    .tr-dest-pill { background: #eff6ff; color: #1d4ed8; font-size: 0.75rem; font-weight: 600; padding: 0.3rem 0.7rem; border-radius: 6px; }
    .tr-duration, .tr-group { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #475569; }
    
    .tr-action-btns { display: flex; gap: 0.5rem; }
    .tr-edit-btn, .tr-delete-btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: transparent; font-size: 0.8rem; font-weight: 500;
      padding: 0.45rem 0.75rem; border-radius: 8px;
      cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
    }
    .tr-edit-btn { color: #3b82f6; border-color: #bfdbfe; }
    .tr-edit-btn:hover { background: #eff6ff; border-color: #3b82f6; }
    .tr-delete-btn { color: #ef4444; border-color: #fecaca; }
    .tr-delete-btn:hover { background: #fef2f2; border-color: #ef4444; }

    .tr-empty-row { padding: 0; }
    .tr-empty { text-align: center; padding: 3.5rem; color: #94a3b8; }
    .tr-empty p { font-size: 0.9rem; margin: 0; }

    /* Modal */
    .tr-modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15,23,42,0.6); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; animation: fadeIn 0.2s ease;
    }
    .tr-modal-card {
      background: #fff; border-radius: 16px; padding: 2rem;
      width: 90%; max-width: 400px; text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
      animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes popIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .tr-modal-icon {
      width: 48px; height: 48px; border-radius: 50%;
      background: #fef2f2; color: #ef4444;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
    }
    .tr-modal-title { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0 0 0.5rem; }
    .tr-modal-msg { font-size: 0.9rem; color: #64748b; margin: 0 0 1.5rem; line-height: 1.5; }
    .tr-modal-actions { display: flex; gap: 0.75rem; justify-content: center; }
    .tr-modal-cancel {
      padding: 0.6rem 1.2rem; background: #fff; border: 1px solid #e2e8f0;
      border-radius: 8px; color: #64748b; font-size: 0.875rem; font-weight: 500;
      cursor: pointer; transition: all 0.2s;
    }
    .tr-modal-cancel:hover { background: #f8fafc; color: #0f172a; border-color: #cbd5e1; }
    .tr-modal-confirm {
      padding: 0.6rem 1.5rem; background: #ef4444; border: none;
      border-radius: 8px; color: #fff; font-size: 0.875rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
    }
    .tr-modal-confirm:hover { background: #dc2626; box-shadow: 0 4px 12px rgba(239,68,68,0.25); }
  `]
})
export class AdminToursComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private tourApi = inject(TourApiService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tours = signal<any[]>([]);
  selectedFilter = signal<string>('all');
  filteredTours = computed(() => {
    if (this.selectedFilter() === 'all') return this.tours();
    return this.tours().filter(t => t.destination.toLowerCase() === this.selectedFilter());
  });

  isLoading = signal(true);
  tourToDelete = signal<string | null>(null);

  ngOnInit() {
    this.loadTours();
  }

  loadTours() {
    this.isLoading.set(true);
    this.tourApi.getTours().subscribe({
      next: (tours: any[]) => {
        this.tours.set(tours || []);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.notification.showError('Failed to load tours');
        this.isLoading.set(false);
      }
    });
  }

  toggleForm() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  openEditForm(tour: any) {
    this.router.navigate(['edit', tour._id], { relativeTo: this.route, state: { tour } });
  }

  confirmDelete(id: string) {
    this.tourToDelete.set(id);
  }

  cancelDelete() {
    this.tourToDelete.set(null);
  }

  executeDelete() {
    const id = this.tourToDelete();
    if (!id) return;
    
    this.adminApi.deleteTour(id).subscribe({
      next: () => {
        this.notification.showSuccess('Tour deleted successfully');
        this.tourToDelete.set(null);
        this.loadTours();
      },
      error: () => {
        this.notification.showError('Failed to delete tour');
        this.tourToDelete.set(null);
      }
    });
  }
}
