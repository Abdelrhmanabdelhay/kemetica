import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../../../data/services/admin-api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="us-page">

      <div class="us-header">
        <div>
          <h1 class="us-title">Users</h1>
          <p class="us-subtitle">Manage administrator accounts and permissions.</p>
        </div>
        <button class="us-add-btn" (click)="toggleForm()" *ngIf="!showAddForm()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Admin User
        </button>
      </div>

      <!-- Slide-in Form -->
      <div class="us-form-panel" [class.us-form-panel--open]="showAddForm()">
        <div class="us-form-card" *ngIf="showAddForm()">
          <div class="us-form-header">
            <div>
              <h2 class="us-form-title">Create Administrator</h2>
              <p class="us-form-sub">This account will have full access to the admin portal.</p>
            </div>
            <button class="us-form-close" (click)="toggleForm()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="us-form">
            <div class="us-form-row">
              <div class="us-field">
                <label class="us-label">Full Name</label>
                <input type="text" formControlName="fullName" class="us-input" placeholder="e.g. Ahmed Hassan" />
                <p class="us-field-error" *ngIf="userForm.get('fullName')?.invalid && userForm.get('fullName')?.touched">Name is required</p>
              </div>
              <div class="us-field">
                <label class="us-label">Email Address</label>
                <input type="email" formControlName="email" class="us-input" placeholder="admin@kemetica.com" />
                <p class="us-field-error" *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">Valid email required</p>
              </div>
            </div>
            <div class="us-form-row">
              <div class="us-field">
                <label class="us-label">Password</label>
                <div class="us-password-wrap">
                  <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" class="us-input us-input--password" placeholder="Min. 6 characters" />
                  <button type="button" class="us-password-toggle" (click)="togglePassword()">
                    <svg *ngIf="!showPassword()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    <svg *ngIf="showPassword()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  </button>
                </div>
                <p class="us-field-error" *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">Min. 6 characters</p>
              </div>
              <div class="us-field us-field--center">
                <div class="us-role-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  Role: Administrator
                </div>
              </div>
            </div>
            <div class="us-form-actions">
              <button type="button" class="us-btn-cancel" (click)="toggleForm()">Cancel</button>
              <button type="submit" class="us-btn-submit" [disabled]="userForm.invalid || isSubmitting()">
                <span *ngIf="!isSubmitting()">Create Account</span>
                <div *ngIf="isSubmitting()" class="us-mini-spinner"></div>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="us-loading">
        <div class="us-spinner"></div>
        <p>Loading users...</p>
      </div>

      <!-- Table -->
      <div *ngIf="!isLoading()" class="us-table-wrap">
        <table class="us-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users(); let i = index" class="us-row" [style.animation-delay]="(i * 0.05) + 's'">
              <td>
                <div class="us-user-cell">
                  <div class="us-user-avatar">
                    <img *ngIf="user.avatarUrl" [src]="user.avatarUrl" class="us-avatar-img" />
                    <span *ngIf="!user.avatarUrl">{{ (user.fullName || 'U').charAt(0) }}</span>
                  </div>
                  <div>
                    <p class="us-user-name">{{ user.fullName }}</p>
                    <p class="us-user-id">ID: {{ user._id | slice:0:10 }}...</p>
                  </div>
                </div>
              </td>
              <td><span class="us-email">{{ user.email }}</span></td>
              <td>
                <span class="us-role-chip" [class.us-role-chip--admin]="user.role === 'admin'" [class.us-role-chip--user]="user.role !== 'admin'">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <button (click)="confirmDelete(user._id)" class="us-delete-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="users().length === 0">
              <td colspan="4" class="us-empty-row">No users found.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

      <!-- Delete Confirmation Modal -->
      <div class="tr-modal-overlay" *ngIf="userToDelete()">
        <div class="tr-modal-card">
          <div class="tr-modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3 class="tr-modal-title">Delete User?</h3>
          <p class="tr-modal-msg">Are you sure you want to permanently delete this user? This action cannot be undone.</p>
          <div class="tr-modal-actions">
            <button class="tr-modal-cancel" (click)="cancelDelete()">Cancel</button>
            <button class="tr-modal-confirm" (click)="executeDelete()">Delete</button>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .us-page { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .us-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
    .us-title { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem; }
    .us-subtitle { font-size: 0.9rem; color: #64748b; margin: 0; }
    .us-add-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: #0f172a; color: #fff;
      border: none; border-radius: 10px;
      padding: 0.7rem 1.25rem;
      font-size: 0.875rem; font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(15,23,42,0.2);
    }
    .us-add-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(15,23,42,0.25); }

    /* Form Panel */
    .us-form-panel {
      max-height: 0; overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: 0;
    }
    .us-form-panel--open { max-height: 500px; margin-bottom: 1.5rem; }
    .us-form-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .us-form-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .us-form-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem; }
    .us-form-sub { font-size: 0.8rem; color: #94a3b8; margin: 0; }
    .us-form-close {
      width: 32px; height: 32px; border-radius: 8px;
      background: #f1f5f9; border: none; color: #64748b;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s;
    }
    .us-form-close:hover { background: #fee2e2; color: #ef4444; }
    .us-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .us-field { display: flex; flex-direction: column; gap: 0.4rem; }
    .us-field--center { justify-content: center; }
    .us-label { font-size: 0.8rem; font-weight: 600; color: #475569; }
    .us-input {
      padding: 0.7rem 0.875rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #1e293b;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      width: 100%;
      box-sizing: border-box;
    }
    .us-input:focus { border-color: #d4af37; box-shadow: 0 0 0 3px rgba(212,175,55,0.1); }
    .us-password-wrap { position: relative; display: flex; align-items: center; }
    .us-input--password { padding-right: 2.5rem; }
    .us-password-toggle {
      position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%);
      background: none; border: none; color: #94a3b8;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      padding: 0.25rem; border-radius: 4px; transition: color 0.2s;
    }
    .us-password-toggle:hover { color: #1e293b; }
    .us-field-error { font-size: 0.75rem; color: #ef4444; margin: 0; }
    .us-role-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: linear-gradient(135deg, #fef9c3, #fef3c7);
      border: 1px solid #fde68a;
      color: #92400e;
      font-size: 0.8rem; font-weight: 600;
      padding: 0.5rem 0.875rem;
      border-radius: 8px;
    }
    .us-form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 0.5rem; border-top: 1px solid #f1f5f9; margin-top: 1rem; }
    .us-btn-cancel {
      padding: 0.65rem 1.25rem; background: transparent;
      border: 1px solid #e2e8f0; border-radius: 8px;
      color: #64748b; font-size: 0.875rem; font-weight: 500; cursor: pointer;
      transition: all 0.2s;
    }
    .us-btn-cancel:hover { border-color: #cbd5e1; background: #f8fafc; }
    .us-btn-submit {
      padding: 0.65rem 1.5rem;
      background: linear-gradient(135deg, #d4af37, #b8860b);
      border: none; border-radius: 8px;
      color: #0f172a; font-size: 0.875rem; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
      min-width: 130px;
      display: flex; align-items: center; justify-content: center;
    }
    .us-btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(212,175,55,0.3); }
    .us-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .us-mini-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(15,23,42,0.2);
      border-top-color: #0f172a;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Loading */
    .us-loading { text-align: center; padding: 4rem; color: #94a3b8; }
    .us-spinner {
      width: 36px; height: 36px;
      border: 3px solid #f1f5f9; border-top-color: #d4af37;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }

    /* Table */
    .us-table-wrap {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .us-table { width: 100%; border-collapse: collapse; }
    .us-table thead th {
      padding: 1rem 1.25rem;
      text-align: left;
      font-size: 0.72rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.06em;
      color: #94a3b8; background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .us-row {
      border-bottom: 1px solid #f1f5f9;
      transition: background 0.15s;
      animation: rowIn 0.35s ease both;
    }
    @keyframes rowIn { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }
    .us-row:last-child { border-bottom: none; }
    .us-row:hover { background: #fafbfc; }
    .us-table tbody td { padding: 1rem 1.25rem; vertical-align: middle; }

    .us-user-cell { display: flex; align-items: center; gap: 0.875rem; }
    .us-user-avatar {
      width: 38px; height: 38px;
      background: linear-gradient(135deg, #d4af37, #b8860b);
      color: #0f172a; font-weight: 800; font-size: 0.9rem;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; overflow: hidden;
    }
    .us-avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .us-user-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0 0 0.15rem; }
    .us-user-id { font-size: 0.7rem; color: #94a3b8; margin: 0; font-family: monospace; }
    .us-email { font-size: 0.85rem; color: #475569; }
    .us-role-chip {
      font-size: 0.72rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
      padding: 0.3rem 0.7rem; border-radius: 6px;
    }
    .us-role-chip--admin { background: #fef9c3; color: #92400e; border: 1px solid #fde68a; }
    .us-role-chip--user { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .us-delete-btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: transparent; border: 1px solid #fecaca;
      color: #ef4444; font-size: 0.8rem; font-weight: 500;
      padding: 0.45rem 0.75rem; border-radius: 8px;
      cursor: pointer; transition: all 0.2s;
    }
    .us-delete-btn:hover { background: #fef2f2; border-color: #ef4444; }
    .us-empty-row { text-align: center; padding: 3rem; color: #94a3b8; font-size: 0.9rem; }

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
export class AdminUsersComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  users = signal<any[]>([]);
  isLoading = signal(true);
  showAddForm = signal(false);
  isSubmitting = signal(false);
  showPassword = signal(false);
  userToDelete = signal<string | null>(null);

  userForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['admin']
  });

  ngOnInit() { this.loadUsers(); }

  toggleForm() {
    this.showAddForm.update(v => !v);
    if (!this.showAddForm()) {
      this.userForm.reset({ role: 'admin' });
      this.showPassword.set(false);
    }
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  loadUsers() {
    this.isLoading.set(true);
    this.adminApi.getUsers().subscribe({
      next: (res) => { this.users.set(res.data || []); this.isLoading.set(false); },
      error: () => { this.notification.showError('Failed to load users'); this.isLoading.set(false); }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) { this.userForm.markAllAsTouched(); return; }
    this.isSubmitting.set(true);
    this.adminApi.createUser(this.userForm.value).subscribe({
      next: () => {
        this.notification.showSuccess('Admin user created successfully');
        this.toggleForm();
        this.loadUsers();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.notification.showError(err.error?.message || 'Failed to create user');
        this.isSubmitting.set(false);
      }
    });
  }

  confirmDelete(id: string) {
    this.userToDelete.set(id);
  }

  cancelDelete() {
    this.userToDelete.set(null);
  }

  executeDelete() {
    const id = this.userToDelete();
    if (!id) return;

    this.adminApi.deleteUser(id).subscribe({
      next: () => { 
        this.notification.showSuccess('User deleted'); 
        this.users.update(u => u.filter(x => x._id !== id)); 
        this.userToDelete.set(null);
      },
      error: () => {
        this.notification.showError('Failed to delete user');
        this.userToDelete.set(null);
      }
    });
  }
}
