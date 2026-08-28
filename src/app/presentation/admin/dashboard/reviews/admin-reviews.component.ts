import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../../../data/services/admin-api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rv-page">

      <div class="rv-header">
        <div>
          <h1 class="rv-title">Reviews</h1>
          <p class="rv-subtitle">Monitor and moderate customer feedback across all tours.</p>
        </div>
        <div class="rv-badge">
          <span>{{ reviews().length }} total</span>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="rv-loading">
        <div class="rv-spinner"></div>
        <p>Fetching reviews...</p>
      </div>

      <!-- Empty -->
      <div *ngIf="!isLoading() && reviews().length === 0" class="rv-empty">
        <div class="rv-empty-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </div>
        <p class="rv-empty-title">No reviews yet</p>
        <p class="rv-empty-sub">Customer reviews will appear here after tours are booked.</p>
      </div>

      <!-- Table -->
      <div *ngIf="!isLoading() && reviews().length > 0" class="rv-table-wrap">
        <table class="rv-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Tour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let review of reviews(); let i = index" class="rv-row" [style.animation-delay]="(i * 0.05) + 's'">
              <td>
                <div class="rv-author">
                  <div class="rv-avatar">{{ (review.authorName || 'A').charAt(0) }}</div>
                  <span class="rv-author-name">{{ review.authorName || 'Anonymous' }}</span>
                </div>
              </td>
              <td>
                <div class="rv-stars">
                  <span *ngFor="let s of [1,2,3,4,5]" class="rv-star" [class.rv-star--on]="s <= review.rating">★</span>
                  <span class="rv-rating-num">{{ review.rating }}/5</span>
                </div>
              </td>
              <td>
                <p class="rv-comment" [title]="review.comment">{{ review.comment }}</p>
              </td>
              <td>
                <span class="rv-tour-pill">{{ review.tour?.title || 'Unknown Tour' }}</span>
              </td>
              <td>
                <button (click)="confirmDelete(review._id)" class="rv-delete-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="tr-modal-overlay" *ngIf="reviewToDelete()">
        <div class="tr-modal-card">
          <div class="tr-modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3 class="tr-modal-title">Delete Review?</h3>
          <p class="tr-modal-msg">Are you sure you want to permanently delete this review? This action cannot be undone.</p>
          <div class="tr-modal-actions">
            <button class="tr-modal-cancel" (click)="cancelDelete()">Cancel</button>
            <button class="tr-modal-confirm" (click)="executeDelete()">Delete</button>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .rv-page { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .rv-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
    .rv-title { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem; }
    .rv-subtitle { font-size: 0.9rem; color: #64748b; margin: 0; }
    .rv-badge {
      background: linear-gradient(135deg, #fef9c3, #fef08a);
      border: 1px solid #fde68a;
      color: #854d0e;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.4rem 0.875rem;
      border-radius: 999px;
    }

    .rv-loading { text-align: center; padding: 4rem; color: #94a3b8; }
    .rv-spinner {
      width: 36px; height: 36px;
      border: 3px solid #f1f5f9;
      border-top-color: #d4af37;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .rv-empty { text-align: center; padding: 5rem 2rem; }
    .rv-empty-icon { width: 72px; height: 72px; background: #fef9c3; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #d4af37; }
    .rv-empty-title { font-size: 1.1rem; font-weight: 600; color: #1e293b; margin: 0 0 0.5rem; }
    .rv-empty-sub { font-size: 0.875rem; color: #94a3b8; margin: 0; }

    .rv-table-wrap {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .rv-table { width: 100%; border-collapse: collapse; }
    .rv-table thead th {
      padding: 1rem 1.25rem;
      text-align: left;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #94a3b8;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .rv-row {
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.15s;
      animation: rowIn 0.4s ease both;
    }
    @keyframes rowIn { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }
    .rv-row:last-child { border-bottom: none; }
    .rv-row:hover { background: #fafbfc; }
    .rv-table tbody td { padding: 1rem 1.25rem; vertical-align: middle; }

    .rv-author { display: flex; align-items: center; gap: 0.75rem; }
    .rv-avatar {
      width: 34px; height: 34px;
      background: linear-gradient(135deg, #d4af37, #b8860b);
      color: #0f172a;
      font-size: 0.8rem;
      font-weight: 800;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .rv-author-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; }

    .rv-stars { display: flex; align-items: center; gap: 0.25rem; }
    .rv-star { font-size: 1rem; color: #e2e8f0; }
    .rv-star--on { color: #f59e0b; }
    .rv-rating-num { font-size: 0.75rem; color: #94a3b8; margin-left: 0.25rem; }

    .rv-comment {
      font-size: 0.85rem;
      color: #475569;
      margin: 0;
      max-width: 260px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .rv-tour-pill {
      background: #f1f5f9;
      color: #475569;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      white-space: nowrap;
    }

    .rv-delete-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: transparent;
      border: 1px solid #fecaca;
      color: #ef4444;
      font-size: 0.8rem;
      font-weight: 500;
      padding: 0.45rem 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .rv-delete-btn:hover { background: #fef2f2; border-color: #ef4444; }

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
export class AdminReviewsComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private notification = inject(NotificationService);

  reviews = signal<any[]>([]);
  isLoading = signal(true);
  reviewToDelete = signal<string | null>(null);

  ngOnInit() { this.loadReviews(); }

  loadReviews() {
    this.isLoading.set(true);
    this.adminApi.getReviews().subscribe({
      next: (res) => { this.reviews.set(res.data || []); this.isLoading.set(false); },
      error: () => { this.notification.showError('Failed to load reviews'); this.isLoading.set(false); }
    });
  }

  confirmDelete(id: string) {
    this.reviewToDelete.set(id);
  }

  cancelDelete() {
    this.reviewToDelete.set(null);
  }

  executeDelete() {
    const id = this.reviewToDelete();
    if (!id) return;

    this.adminApi.deleteReview(id).subscribe({
      next: () => {
        this.notification.showSuccess('Review deleted');
        this.reviews.update(r => r.filter(x => x._id !== id));
        this.reviewToDelete.set(null);
      },
      error: () => {
        this.notification.showError('Failed to delete review');
        this.reviewToDelete.set(null);
      }
    });
  }
}
