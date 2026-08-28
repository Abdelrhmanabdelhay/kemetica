import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="kmt-dash">
      <!-- Sidebar -->
      <aside class="kmt-sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="kmt-sidebar-top">
          <div class="kmt-brand">
            <img src="/logo-Photoroom.png" alt="Kemetica" class="kmt-brand-logo" />
            <span class="kmt-brand-badge" *ngIf="!sidebarCollapsed">ADMIN</span>
          </div>
          <button class="kmt-collapse-btn" (click)="sidebarCollapsed = !sidebarCollapsed" [title]="sidebarCollapsed ? 'Expand' : 'Collapse'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline [attr.points]="sidebarCollapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'"></polyline>
            </svg>
          </button>
        </div>

        <nav class="kmt-nav">
          <p class="kmt-nav-label" *ngIf="!sidebarCollapsed">MANAGEMENT</p>

          <a routerLink="/admin/dashboard/overview" routerLinkActive="kmt-nav-active" class="kmt-nav-link" title="Overview">
            <span class="kmt-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
              </svg>
            </span>
            <span class="kmt-nav-text" *ngIf="!sidebarCollapsed">Overview</span>
          </a>

          <a routerLink="/admin/dashboard/tours" routerLinkActive="kmt-nav-active" class="kmt-nav-link" title="Tours">
            <span class="kmt-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </span>
            <span class="kmt-nav-text" *ngIf="!sidebarCollapsed">Tours</span>
          </a>

          <a routerLink="/admin/dashboard/users" routerLinkActive="kmt-nav-active" class="kmt-nav-link" title="Users">
            <span class="kmt-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </span>
            <span class="kmt-nav-text" *ngIf="!sidebarCollapsed">Users</span>
          </a>

          <a routerLink="/admin/dashboard/categories" routerLinkActive="kmt-nav-active" class="kmt-nav-link" title="Categories">
            <span class="kmt-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </span>
            <span class="kmt-nav-text" *ngIf="!sidebarCollapsed">Categories</span>
          </a>

          <a routerLink="/admin/dashboard/reviews" routerLinkActive="kmt-nav-active" class="kmt-nav-link" title="Reviews">
            <span class="kmt-nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </span>
            <span class="kmt-nav-text" *ngIf="!sidebarCollapsed">Reviews</span>
          </a>
        </nav>

        <div class="kmt-sidebar-footer">
          <div class="kmt-user-card" *ngIf="!sidebarCollapsed">
            <div class="kmt-user-avatar">{{ getUserInitial() }}</div>
            <div class="kmt-user-info">
              <span class="kmt-user-name">{{ getUserName() }}</span>
              <span class="kmt-user-role">Administrator</span>
            </div>
          </div>
          <button class="kmt-logout-btn" (click)="logout()" [title]="sidebarCollapsed ? 'Logout' : ''">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span *ngIf="!sidebarCollapsed">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="kmt-main">
        <header class="kmt-topbar">
          <div class="kmt-topbar-left">
            <div class="kmt-breadcrumb">
              <span class="kmt-breadcrumb-root">Kemetica</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              <span class="kmt-breadcrumb-current">Admin Portal</span>
            </div>
          </div>
          <div class="kmt-topbar-right">
            <div class="kmt-topbar-pill">
              <span class="kmt-live-dot"></span>
              <span>Live</span>
            </div>
            <div class="kmt-topbar-avatar">{{ getUserInitial() }}</div>
          </div>
        </header>
        <main class="kmt-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }

    .kmt-dash {
      display: flex;
      height: 100vh;
      background: #f1f5f9;
      font-family: 'Inter', 'Outfit', system-ui, sans-serif;
      overflow: hidden;
    }

    /* ── SIDEBAR ── */
    .kmt-sidebar {
      width: 260px;
      min-width: 260px;
      background: #0f172a;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 10;
      border-right: 1px solid rgba(255,255,255,0.04);
    }
    .kmt-sidebar.collapsed {
      width: 72px;
      min-width: 72px;
    }

    .kmt-sidebar-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.25rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .kmt-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      overflow: hidden;
    }
    .kmt-brand-logo {
      height: 36px;
      width: auto;
      flex-shrink: 0;
      filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.2));
    }
    .kmt-brand-badge {
      background: linear-gradient(135deg, #d4af37, #b8860b);
      color: #0f172a;
      font-size: 0.6rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      white-space: nowrap;
    }
    .kmt-collapse-btn {
      background: rgba(255,255,255,0.06);
      border: none;
      color: #64748b;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .kmt-collapse-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

    /* NAV */
    .kmt-nav {
      flex: 1;
      padding: 1.25rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      overflow-y: auto;
    }
    .kmt-nav-label {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #334155;
      padding: 0 0.625rem;
      margin: 0.5rem 0 0.25rem;
    }
    .kmt-nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      border-radius: 8px;
      color: #64748b;
      text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap;
      overflow: hidden;
    }
    .kmt-nav-link:hover { background: rgba(255,255,255,0.06); color: #cbd5e1; }
    .kmt-nav-link.kmt-nav-active {
      background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05));
      color: #d4af37;
      box-shadow: inset 3px 0 0 #d4af37;
    }
    .kmt-nav-icon { display: flex; align-items: center; flex-shrink: 0; }
    .kmt-nav-text { font-size: 0.9rem; font-weight: 500; }

    /* FOOTER */
    .kmt-sidebar-footer {
      padding: 1rem 0.75rem;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .kmt-user-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.25rem;
    }
    .kmt-user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d4af37, #b8860b);
      color: #0f172a;
      font-weight: 800;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .kmt-user-info { display: flex; flex-direction: column; overflow: hidden; }
    .kmt-user-name { font-size: 0.825rem; font-weight: 600; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .kmt-user-role { font-size: 0.7rem; color: #475569; }
    .kmt-logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.08);
      color: #475569;
      cursor: pointer;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: all 0.2s;
      width: 100%;
      justify-content: center;
    }
    .kmt-logout-btn:hover { border-color: rgba(239,68,68,0.4); color: #f87171; background: rgba(239,68,68,0.07); }

    /* ── TOPBAR ── */
    .kmt-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .kmt-topbar {
      height: 60px;
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      flex-shrink: 0;
    }
    .kmt-breadcrumb { display: flex; align-items: center; gap: 0.4rem; }
    .kmt-breadcrumb-root { font-size: 0.8rem; color: #94a3b8; }
    .kmt-breadcrumb svg { color: #cbd5e1; }
    .kmt-breadcrumb-current { font-size: 0.875rem; font-weight: 600; color: #1e293b; }
    .kmt-topbar-right { display: flex; align-items: center; gap: 1rem; }
    .kmt-topbar-pill {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
    }
    .kmt-live-dot {
      width: 6px; height: 6px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
    .kmt-topbar-avatar {
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, #d4af37, #b8860b);
      color: #0f172a;
      font-weight: 800;
      font-size: 0.85rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ── CONTENT ── */
    .kmt-content { flex: 1; overflow-y: auto; padding: 2rem; }
  `]
})
export class AdminLayoutComponent {
  sidebarCollapsed = false;
  private authService = inject(AuthService);
  private router = inject(Router);

  getUserName(): string {
    return this.authService.currentUserValue?.fullName || 'Admin';
  }

  getUserInitial(): string {
    return (this.authService.currentUserValue?.fullName || 'A').charAt(0).toUpperCase();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/admin/login']);
    });
  }
}
