import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminApiService } from '../../../../data/services/admin-api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="tr-page">
      <!-- Header -->
      <div class="tr-header">
        <div>
          <h1 class="tr-title">Categories</h1>
          <p class="tr-subtitle">Manage tour categories for the platform.</p>
        </div>
        <button class="tr-add-btn" (click)="openCreateForm()" *ngIf="!showForm()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Category
        </button>
      </div>

      <!-- Form Panel -->
      <div class="tr-form-wrap" *ngIf="showForm()">
        <div class="tr-form-card">
          <div class="tr-form-header">
            <div>
              <h2 class="tr-form-title">{{ isEditing() ? 'Edit Category' : 'Create New Category' }}</h2>
              <p class="tr-form-sub">{{ isEditing() ? 'Update the details below' : 'Fill in the details for the new category' }}</p>
            </div>
            <button class="tr-form-close" (click)="closeForm()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form [formGroup]="catForm" (ngSubmit)="onSubmit()">
            <div class="tr-section">
              <div class="tr-form-grid">
                <div class="tr-field tr-field--span2">
                  <label class="tr-label">Category Name <span class="req">*</span></label>
                  <input type="text" formControlName="name" class="tr-input" placeholder="e.g. Historical" />
                </div>
                <div class="tr-field tr-field--span2">
                  <label class="tr-label">Description</label>
                  <textarea formControlName="description" class="tr-textarea" rows="2" placeholder="Brief description..."></textarea>
                </div>
                <div class="tr-field">
                  <label class="tr-label">Display Order</label>
                  <input type="number" formControlName="display_order" class="tr-input" min="1" />
                </div>
                <div class="tr-field" style="justify-content: center; padding-top: 1.5rem;">
                  <label class="tr-toggle-label">
                    <input type="checkbox" formControlName="is_active" class="tr-toggle-input">
                    <span class="tr-toggle-switch"></span>
                    <span class="tr-label" style="margin-left: 0.5rem">Active Status</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="tr-form-actions">
              <button type="button" class="tr-btn-cancel" (click)="closeForm()">Cancel</button>
              <button type="submit" class="tr-btn-submit" [disabled]="catForm.invalid || isSubmitting()">
                <span *ngIf="!isSubmitting()">{{ isEditing() ? 'Update' : 'Save' }}</span>
                <div *ngIf="isSubmitting()" class="tr-mini-spinner"></div>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading()" class="tr-loading">
        <div class="tr-spinner"></div>
        <p>Loading categories...</p>
      </div>

      <!-- Table -->
      <div *ngIf="!isLoading()" class="tr-table-wrap">
        <table class="tr-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let cat of categories(); let i = index" class="tr-row" [style.animation-delay]="(i * 0.05) + 's'">
              <td>
                <p class="tr-tour-name">{{ cat.name }}</p>
                <p class="tr-tour-tag">/{{ cat.slug }}</p>
              </td>
              <td><span class="tr-desc-text">{{ cat.description || '—' }}</span></td>
              <td>
                <span class="tr-status-badge" [class.active]="cat.is_active" [class.inactive]="!cat.is_active">
                  {{ cat.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td><span class="tr-order-pill">{{ cat.display_order }}</span></td>
              <td>
                <div class="tr-action-btns">
                  <button (click)="toggleStatus(cat._id)" class="tr-icon-btn tr-icon-btn--yellow" [title]="cat.is_active ? 'Deactivate' : 'Activate'">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  </button>
                  <button (click)="openEditForm(cat)" class="tr-icon-btn tr-icon-btn--blue" title="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button (click)="confirmDelete(cat._id)" class="tr-icon-btn tr-icon-btn--red" title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="categories().length === 0">
              <td colspan="5" class="tr-empty-row">
                <div class="tr-empty">
                  <div style="font-size:2.5rem;margin-bottom:.75rem">📂</div>
                  <p>No categories found. Create one above.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

      <!-- Delete Confirmation Modal -->
      <div class="tr-modal-overlay" *ngIf="categoryToDelete()">
        <div class="tr-modal-card">
          <div class="tr-modal-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3 class="tr-modal-title">Delete Category?</h3>
          <p class="tr-modal-msg">Are you sure you want to permanently delete this category? (This action will fail if tours are using it.)</p>
          <div class="tr-modal-actions">
            <button class="tr-modal-cancel" (click)="cancelDelete()">Cancel</button>
            <button class="tr-modal-confirm" (click)="executeDelete()">Delete</button>
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

    .tr-form-wrap { margin-bottom: 2rem; }
    .tr-form-card {
      background: #fff; border: 1px solid #e2e8f0;
      border-radius: 20px; overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    }
    .tr-form-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 1.75rem 2rem; border-bottom: 1px solid #f1f5f9;
      background: linear-gradient(135deg, #0f172a, #1e293b);
    }
    .tr-form-title { font-size: 1.2rem; font-weight: 700; color: #f1f5f9; margin: 0 0 0.25rem; }
    .tr-form-sub { font-size: 0.8rem; color: #64748b; margin: 0; }
    .tr-form-close {
      width: 32px; height: 32px; border-radius: 8px;
      background: rgba(255,255,255,0.1); border: none; color: #94a3b8;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; flex-shrink: 0;
    }
    .tr-form-close:hover { background: rgba(239,68,68,0.2); color: #f87171; }

    .tr-section { padding: 1.75rem 2rem; }
    .tr-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .tr-field { display: flex; flex-direction: column; gap: 0.4rem; }
    .tr-field--span2 { grid-column: span 2; }
    .tr-label { font-size: 0.8rem; font-weight: 600; color: #475569; }
    .req { color: #ef4444; }
    .tr-input, .tr-textarea {
      padding: 0.7rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 8px;
      font-size: 0.9rem; color: #1e293b; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s; background: #fff; font-family: inherit;
    }
    .tr-input:focus, .tr-textarea:focus { border-color: #d4af37; box-shadow: 0 0 0 3px rgba(212,175,55,0.1); }
    .tr-textarea { resize: vertical; }

    /* Toggle Switch */
    .tr-toggle-label { display: inline-flex; align-items: center; cursor: pointer; }
    .tr-toggle-input { display: none; }
    .tr-toggle-switch {
      position: relative; width: 44px; height: 24px;
      background: #cbd5e1; border-radius: 12px; transition: 0.3s;
    }
    .tr-toggle-switch::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 20px; height: 20px; background: #fff; border-radius: 50%;
      transition: 0.3s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .tr-toggle-input:checked + .tr-toggle-switch { background: #22c55e; }
    .tr-toggle-input:checked + .tr-toggle-switch::after { transform: translateX(20px); }

    .tr-form-actions {
      display: flex; justify-content: flex-end; gap: 0.75rem;
      padding: 1.5rem 2rem; background: #f8fafc; border-top: 1px solid #e2e8f0;
    }
    .tr-btn-cancel {
      padding: 0.7rem 1.5rem; background: #fff;
      border: 1px solid #e2e8f0; border-radius: 10px;
      color: #64748b; font-size: 0.875rem; font-weight: 500;
      cursor: pointer; transition: all 0.2s;
    }
    .tr-btn-cancel:hover { background: #f8fafc; border-color: #cbd5e1; }
    .tr-btn-submit {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.7rem 1.75rem; background: linear-gradient(135deg, #d4af37, #b8860b);
      border: none; border-radius: 10px; color: #0f172a; font-size: 0.875rem; font-weight: 700;
      cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(212,175,55,0.25);
      min-width: 100px; justify-content: center;
    }
    .tr-btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212,175,55,0.35); }
    .tr-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .tr-mini-spinner { width: 16px; height: 16px; border: 2px solid rgba(15,23,42,0.25); border-top-color: #0f172a; border-radius: 50%; animation: spin 0.8s linear infinite; }
    
    .tr-loading { text-align: center; padding: 4rem; color: #94a3b8; }
    .tr-spinner { width: 36px; height: 36px; border: 3px solid #f1f5f9; border-top-color: #d4af37; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .tr-table-wrap { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .tr-table { width: 100%; border-collapse: collapse; }
    .tr-table thead th { padding: 1rem 1.25rem; text-align: left; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
    .tr-row { border-bottom: 1px solid #f1f5f9; transition: background 0.15s; animation: rowIn 0.35s ease both; }
    @keyframes rowIn { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: translateX(0); } }
    .tr-row:last-child { border-bottom: none; }
    .tr-row:hover { background: #fafbfc; }
    .tr-table tbody td { padding: 1rem 1.25rem; vertical-align: middle; }
    .tr-tour-name { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0 0 0.2rem; }
    .tr-tour-tag { font-size: 0.75rem; color: #94a3b8; margin: 0; }
    .tr-desc-text { font-size: 0.85rem; color: #475569; }
    .tr-order-pill { background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 6px; }
    
    .tr-status-badge { font-size: 0.7rem; font-weight: 600; padding: 0.3rem 0.7rem; border-radius: 999px; }
    .tr-status-badge.active { background: #dcfce7; color: #166534; }
    .tr-status-badge.inactive { background: #fee2e2; color: #991b1b; }

    .tr-action-btns { display: flex; gap: 0.4rem; }
    .tr-icon-btn {
      width: 32px; height: 32px; border: 1px solid #e2e8f0; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      background: #fff; cursor: pointer; transition: all 0.2s;
    }
    .tr-icon-btn--blue { color: #3b82f6; }
    .tr-icon-btn--blue:hover { border-color: #3b82f6; background: #eff6ff; }
    .tr-icon-btn--red { color: #ef4444; }
    .tr-icon-btn--red:hover { border-color: #ef4444; background: #fef2f2; }
    .tr-icon-btn--yellow { color: #eab308; }
    .tr-icon-btn--yellow:hover { border-color: #eab308; background: #fefce8; }

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
export class AdminCategoriesComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);

  categories = signal<any[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  isSubmitting = signal(false);
  isEditing = signal(false);
  editingId = signal<string | null>(null);
  categoryToDelete = signal<string | null>(null);

  catForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    display_order: [1],
    is_active: [true]
  });

  ngOnInit() { this.loadCategories(); }

  loadCategories() {
    this.isLoading.set(true);
    this.adminApi.getCategories().subscribe({
      next: (res) => { this.categories.set(res.data?.data || res.data || []); this.isLoading.set(false); },
      error: () => { this.notification.showError('Failed to load categories'); this.isLoading.set(false); }
    });
  }

  openCreateForm() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.catForm.reset({ display_order: 1, is_active: true });
    this.showForm.set(true);
  }

  openEditForm(cat: any) {
    this.isEditing.set(true);
    this.editingId.set(cat._id);
    this.catForm.patchValue({
      name: cat.name,
      description: cat.description,
      display_order: cat.display_order,
      is_active: cat.is_active
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  onSubmit() {
    if (this.catForm.invalid) { this.catForm.markAllAsTouched(); return; }
    this.isSubmitting.set(true);

    const data = this.catForm.value;
    const request$ = this.isEditing()
      ? this.adminApi.updateCategory(this.editingId()!, data)
      : this.adminApi.createCategory(data);

    request$.subscribe({
      next: () => {
        this.notification.showSuccess(`Category ${this.isEditing() ? 'updated' : 'created'} successfully!`);
        this.closeForm();
        this.loadCategories();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.notification.showError(err.error?.message || 'Operation failed');
        this.isSubmitting.set(false);
      }
    });
  }

  toggleStatus(id: string) {
    this.adminApi.toggleCategoryStatus(id).subscribe({
      next: () => { this.notification.showSuccess('Status updated'); this.loadCategories(); },
      error: () => this.notification.showError('Failed to update status')
    });
  }

  confirmDelete(id: string) {
    this.categoryToDelete.set(id);
  }

  cancelDelete() {
    this.categoryToDelete.set(null);
  }

  executeDelete() {
    const id = this.categoryToDelete();
    if (!id) return;

    this.adminApi.deleteCategory(id).subscribe({
      next: () => {
        this.notification.showSuccess('Category deleted');
        this.loadCategories();
        this.categoryToDelete.set(null);
      },
      error: (err) => {
        this.notification.showError(err.error?.message || 'Failed to delete category');
        this.categoryToDelete.set(null);
      }
    });
  }
}
