import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../../../data/services/admin-api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="ov-page">

      <!-- Header -->
      <div class="ov-header">
        <div>
          <h1 class="ov-title">Good day, Admin 👋</h1>
          <p class="ov-subtitle">Here's what's happening on the platform today.</p>
        </div>
        <div class="ov-date">{{ today }}</div>
      </div>

      <!-- Stat Cards -->
      <div class="ov-stats">
        <div class="ov-card ov-card--blue">
          <div class="ov-card-content">
            <p class="ov-card-label">Active Tours</p>
            <p class="ov-card-value">{{ toursCount() }}</p>
            <p class="ov-card-sub">Expedition packages</p>
          </div>
          <div class="ov-card-icon ov-icon--blue">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
        </div>

        <div class="ov-card ov-card--gold">
          <div class="ov-card-content">
            <p class="ov-card-label">Customer Reviews</p>
            <p class="ov-card-value">{{ reviewsCount() }}</p>
            <p class="ov-card-sub">Avg. rating 4.8 ⭐</p>
          </div>
          <div class="ov-card-icon ov-icon--gold">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
        </div>

        <div class="ov-card ov-card--purple">
          <div class="ov-card-content">
            <p class="ov-card-label">Admin Users</p>
            <p class="ov-card-value">{{ usersCount() }}</p>
            <p class="ov-card-sub">Authorized accounts</p>
          </div>
          <div class="ov-card-icon ov-icon--purple">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
        </div>

        <div class="ov-card ov-card--green">
          <div class="ov-card-content">
            <p class="ov-card-label">System Status</p>
            <p class="ov-card-value ov-value--green">Online</p>
            <p class="ov-card-sub">All services running</p>
          </div>
          <div class="ov-card-icon ov-icon--green">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="ov-bottom">
        <div class="ov-section">
          <h2 class="ov-section-title">Quick Actions</h2>
          <div class="ov-actions">
            <a routerLink="/admin/dashboard/tours" [queryParams]="{ action: 'add' }" class="ov-action-card">
              <div class="ov-action-icon" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
              <div>
                <p class="ov-action-title">Add New Tour</p>
                <p class="ov-action-sub">Create a new expedition package</p>
              </div>
              <svg class="ov-action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>

            <a routerLink="/admin/dashboard/users" class="ov-action-card">
              <div class="ov-action-icon" style="background: linear-gradient(135deg, #8b5cf6, #6d28d9);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
              <div>
                <p class="ov-action-title">Add Admin User</p>
                <p class="ov-action-sub">Grant administrative access</p>
              </div>
              <svg class="ov-action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>

            <a routerLink="/admin/dashboard/reviews" class="ov-action-card">
              <div class="ov-action-icon" style="background: linear-gradient(135deg, #d4af37, #b8860b);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </div>
              <div>
                <p class="ov-action-title">Moderate Reviews</p>
                <p class="ov-action-sub">Manage customer feedback</p>
              </div>
              <svg class="ov-action-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </div>
        </div>

        <div class="ov-section ov-section--info">
          <h2 class="ov-section-title">Platform Info</h2>
          <div class="ov-info-card">
            <div class="ov-info-row"><span>Backend API</span><span class="badge badge-green">Connected</span></div>
            <div class="ov-info-row"><span>Database</span><span class="badge badge-green">Healthy</span></div>
            <div class="ov-info-row"><span>Cloudinary CDN</span><span class="badge badge-green">Active</span></div>
            <div class="ov-info-row"><span>Auth Cookies</span><span class="badge badge-green">Secure</span></div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .ov-page { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .ov-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
    .ov-title { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem; }
    .ov-subtitle { font-size: 0.9rem; color: #64748b; margin: 0; }
    .ov-date { font-size: 0.8rem; color: #94a3b8; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.5rem 0.875rem; }

    .ov-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 2rem; }
    .ov-card {
      background: #fff;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #f1f5f9;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.02);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .ov-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.07); }
    .ov-card-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin: 0 0 0.4rem; }
    .ov-card-value { font-size: 2rem; font-weight: 800; color: #0f172a; margin: 0 0 0.25rem; line-height: 1; }
    .ov-value--green { color: #16a34a !important; }
    .ov-card-sub { font-size: 0.75rem; color: #94a3b8; margin: 0; }
    .ov-card-icon {
      width: 52px; height: 52px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .ov-icon--blue { background: #eff6ff; color: #3b82f6; }
    .ov-icon--gold { background: #fefce8; color: #d4af37; }
    .ov-icon--purple { background: #f5f3ff; color: #8b5cf6; }
    .ov-icon--green { background: #f0fdf4; color: #22c55e; }

    .ov-bottom { display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem; }
    .ov-section-title { font-size: 0.9rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem; }
    .ov-actions { display: flex; flex-direction: column; gap: 0.75rem; }
    .ov-action-card {
      display: flex; align-items: center; gap: 1rem;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
    }
    .ov-action-card:hover { border-color: #d4af37; box-shadow: 0 4px 12px rgba(212,175,55,0.1); transform: translateX(4px); }
    .ov-action-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ov-action-title { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0 0 0.15rem; }
    .ov-action-sub { font-size: 0.75rem; color: #94a3b8; margin: 0; }
    .ov-action-arrow { color: #cbd5e1; margin-left: auto; flex-shrink: 0; }
    .ov-section--info {}
    .ov-info-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .ov-info-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.875rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.875rem; color: #475569;
    }
    .ov-info-row:last-child { border-bottom: none; }
    .badge { font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 999px; }
    .badge-green { background: #dcfce7; color: #166534; }
  `]
})
export class OverviewComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private http = inject(HttpClient);

  toursCount = signal<number>(0);
  reviewsCount = signal<number>(0);
  usersCount = signal<number>(0);

  today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  ngOnInit() {
    this.http.get<any>('/api/v1/tours').subscribe({
      next: (res) => this.toursCount.set(res.results || res.data?.data?.length || res.data?.length || 0),
      error: () => console.error('Failed to load tours count')
    });
    this.adminApi.getReviews().subscribe({
      next: (res) => this.reviewsCount.set(res.results || res.data?.length || 0),
      error: () => console.error('Failed to load reviews count')
    });
    this.adminApi.getUsers().subscribe({
      next: (res) => this.usersCount.set(res.results || res.data?.length || 0),
      error: () => console.error('Failed to load users count')
    });
  }
}
