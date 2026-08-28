import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, FormArray,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import { AdminApiService } from '../../../../data/services/admin-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-tour-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="tr-page">
      <div class="tr-form-wrap">
        <div class="tr-form-card">
          <!-- Form Header -->
          <div class="tr-form-header">
            <div>
              <h2 class="tr-form-title">{{ isEditing() ? 'Edit Tour' : 'Create New Tour' }}</h2>
              <p class="tr-form-sub">{{ isEditing() ? 'Update the tour details' : 'Fill in all details carefully. All images must be uploaded before saving.' }}</p>
            </div>
            <button class="tr-form-close" (click)="goBack()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <form [formGroup]="tourForm" (ngSubmit)="onSubmit()">

            <!-- ── SECTION 1: Basics ── -->
            <div class="tr-section">
              <div class="tr-section-label">
                <span class="tr-section-num">1</span>
                Basic Information
              </div>
              <div class="tr-form-grid">
                <div class="tr-field tr-field--span2">
                  <label class="tr-label">Tour Title <span class="req">*</span></label>
                  <input type="text" formControlName="title" class="tr-input" placeholder="e.g. Grand Egyptian Museum Tour" />
                </div>
                <div class="tr-field tr-field--span2">
                  <label class="tr-label">Tagline <span class="req">*</span></label>
                  <input type="text" formControlName="tagline" class="tr-input" placeholder="e.g. Discover ancient artifacts" />
                </div>
                <div class="tr-field">
                  <label class="tr-label">City <span class="req">*</span></label>
                  <input type="text" formControlName="city" class="tr-input" placeholder="e.g. Cairo" />
                </div>
                <div class="tr-field">
                  <label class="tr-label">Category <span class="req">*</span></label>
                  <select formControlName="category" class="tr-input tr-select">
                    <option value="" disabled selected>Select a category</option>
                    <option *ngFor="let cat of fetchedCategories()" [value]="cat._id">{{ cat.name }}</option>
                  </select>
                </div>
                <div class="tr-field">
                  <label class="tr-label">Max Group Size <span class="req">*</span></label>
                  <input type="number" formControlName="max_group_size" class="tr-input" min="1" placeholder="e.g. 15" />
                </div>
                <div class="tr-field tr-field--span2">
                  <label class="tr-label">Description <span class="req">*</span></label>
                  <textarea formControlName="description" class="tr-textarea" rows="3" placeholder="A full day tour covering..."></textarea>
                </div>
                <!-- New Tour Type and Sub Type -->
                <div class="tr-field">
                  <label class="tr-label">Tour Type <span class="req">*</span></label>
                  <select formControlName="tour_type" class="tr-input tr-select">
                    <option value="standard">Standard</option>
                    <option value="special">Special</option>
                    <option value="popular">Popular</option>
                    <option value="new">New</option>
                    <option value="exclusive">Exclusive</option>
                  </select>
                </div>
                <div class="tr-field">
                  <label class="tr-label">Sub Type <span class="req">*</span></label>
                  <select formControlName="sub_type" class="tr-input tr-select">
                    <option value="standard">Standard</option>
                    <option value="gold">Gold</option>
                    <option value="cruise">Cruise</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- ── SECTION 2: Destination & Duration ── -->
            <div class="tr-section">
              <div class="tr-section-label">
                <span class="tr-section-num">2</span>
                Destination & Duration
              </div>
              <div class="tr-form-grid">
                <div class="tr-field tr-field--span2">
                  <label class="tr-label">Destination <span class="req">*</span></label>
                  <div class="tr-dest-chips">
                    <button type="button" class="tr-dest-chip" *ngFor="let d of destinations"
                      [class.tr-dest-chip--active]="tourForm.get('destination')?.value === d.value"
                      (click)="selectDestination(d.value)">
                      <span>{{ d.icon }}</span> {{ d.label }}
                    </button>
                  </div>
                  <p class="tr-field-error" *ngIf="!tourForm.get('destination')?.value && tourForm.get('destination')?.touched">Please select a destination</p>
                </div>
                <div class="tr-field">
                  <label class="tr-label">Duration <span class="req">*</span></label>
                  <div style="display: flex; gap: 0.5rem;">
                    <input type="number" formControlName="duration" class="tr-input" min="1" style="flex: 1;" />
                    <select formControlName="duration_type" class="tr-input tr-select" style="width: 100px;">
                      <option value="Days">Days</option>
                      <option value="Hours">Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── SECTION 3: Images ── -->
            <div class="tr-section">
              <div class="tr-section-label">
                <span class="tr-section-num">3</span>
                Images
              </div>

              <!-- Featured Image -->
              <div class="tr-upload-zone">
                <div class="tr-upload-left">
                  <div class="tr-upload-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </div>
                  <div>
                    <p class="tr-upload-title">Featured Image <span class="req">*</span></p>
                    <p class="tr-upload-sub">Main cover image for the tour card</p>
                  </div>
                </div>
                <div class="tr-upload-right">
                  <div *ngIf="featuredPreview()" class="tr-img-preview">
                    <img [src]="featuredPreview()" alt="Featured" />
                    <button type="button" class="tr-img-remove" (click)="featuredPreview.set(''); tourForm.patchValue({featured_image_url: ''})">✕</button>
                  </div>
                  <label class="tr-upload-btn" [class.uploading]="isUploadingFeatured()">
                    <input type="file" (change)="onFeaturedSelected($event)" accept="image/*" style="display:none" />
                    <svg *ngIf="!isUploadingFeatured()" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    {{ isUploadingFeatured() ? 'Uploading...' : (featuredPreview() ? 'Replace' : 'Upload') }}
                  </label>
                </div>
              </div>

              <!-- Gallery Images -->
              <div class="tr-gallery-section">
                <div class="tr-gallery-header">
                  <div>
                    <p class="tr-upload-title">Gallery Images</p>
                    <p class="tr-upload-sub">Additional photos shown in the tour detail page ({{ galleryUrls().length }} uploaded)</p>
                  </div>
                  <label class="tr-upload-btn" [class.uploading]="isUploadingGallery()">
                    <input type="file" (change)="onGallerySelected($event)" accept="image/*" multiple style="display:none" />
                    <svg *ngIf="!isUploadingGallery()" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    {{ isUploadingGallery() ? 'Uploading ' + galleryUploadProgress() + '...' : 'Add Images' }}
                  </label>
                </div>
                <div class="tr-gallery-grid" *ngIf="galleryUrls().length > 0">
                  <div *ngFor="let url of galleryUrls(); let i = index" class="tr-gallery-item">
                    <img [src]="url" [alt]="'Gallery ' + (i+1)" />
                    <button type="button" class="tr-gallery-remove" (click)="removeGalleryImage(i)">✕</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── SECTION 4: Included / Excluded ── -->
            <div class="tr-section">
              <div class="tr-section-label">
                <span class="tr-section-num">4</span>
                What's Included & Excluded
              </div>
              <div class="tr-two-col">
                <!-- Included -->
                <div class="tr-list-block tr-list-block--green">
                  <div class="tr-list-header">
                    <span class="tr-list-title">✅ Included</span>
                    <button type="button" class="tr-list-add" (click)="addIncluded()">+ Add</button>
                  </div>
                  <div formArrayName="included" class="tr-list-items">
                    <div *ngFor="let ctrl of includedArray.controls; let i = index" class="tr-list-row">
                      <input [formControlName]="i" class="tr-list-input" placeholder="e.g. Guide, Tickets, Lunch..." />
                      <button type="button" class="tr-list-remove" (click)="removeIncluded(i)">✕</button>
                    </div>
                  </div>
                </div>
                <!-- Excluded -->
                <div class="tr-list-block tr-list-block--red">
                  <div class="tr-list-header">
                    <span class="tr-list-title">❌ Excluded</span>
                    <button type="button" class="tr-list-add" (click)="addExcluded()">+ Add</button>
                  </div>
                  <div formArrayName="excluded" class="tr-list-items">
                    <div *ngFor="let ctrl of excludedArray.controls; let i = index" class="tr-list-row">
                      <input [formControlName]="i" class="tr-list-input" placeholder="e.g. Tips, Personal expenses..." />
                      <button type="button" class="tr-list-remove" (click)="removeExcluded(i)">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── SECTION 5: Highlights ── -->
            <div class="tr-section">
              <div class="tr-section-label">
                <span class="tr-section-num">5</span>
                Tour Highlights
              </div>
              <div formArrayName="highlights" class="tr-highlights-list">
                <div *ngFor="let ctrl of highlightsArray.controls; let i = index" class="tr-highlight-row">
                  <span class="tr-highlight-num">{{ i + 1 }}</span>
                  <input [formControlName]="i" class="tr-input" placeholder='e.g. See King Tut"s mask' />
                  <button type="button" class="tr-list-remove" (click)="removeHighlight(i)">✕</button>
                </div>
                <button type="button" class="tr-add-item-btn" (click)="addHighlight()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add Highlight
                </button>
              </div>
            </div>

            <!-- ── SECTION 6: Tour Plan ── -->
            <div class="tr-section">
              <div class="tr-section-label">
                <span class="tr-section-num">6</span>
                Daily Itinerary (Tour Plan)
              </div>
              <div formArrayName="tours_plan" class="tr-plan-list">
                <div *ngFor="let dayCtrl of toursPlanArray.controls; let di = index" [formGroupName]="di" class="tr-day-card">
                  <div class="tr-day-header">
                    <div class="tr-day-badge">Day {{ di + 1 }}</div>
                    <input formControlName="title" class="tr-input tr-day-title-input" [placeholder]="'e.g. Museum Visit'" />
                    <button type="button" class="tr-day-remove" (click)="removeDay(di)" *ngIf="toursPlanArray.length > 1">✕</button>
                  </div>
                  <div formArrayName="description" class="tr-day-activities">
                    <div *ngFor="let actCtrl of getDayActivities(di).controls; let ai = index" [formGroupName]="ai" class="tr-activity-row">
                      <div class="tr-activity-fields">
                        <input formControlName="headline" class="tr-input tr-activity-headline" placeholder="Time of day (e.g. Morning)" />
                        <textarea formControlName="details" class="tr-textarea tr-activity-details" rows="2" placeholder="Describe what happens during this part..."></textarea>
                      </div>
                      <button type="button" class="tr-list-remove" (click)="removeActivity(di, ai)" *ngIf="getDayActivities(di).length > 1">✕</button>
                    </div>
                    <button type="button" class="tr-add-activity-btn" (click)="addActivity(di)">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      Add Activity
                    </button>
                  </div>
                </div>
                <button type="button" class="tr-add-item-btn" (click)="addDay()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  Add Day
                </button>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="tr-form-actions">
              <button type="button" class="tr-btn-cancel" (click)="goBack()">Discard</button>
              <button type="submit" class="tr-btn-submit"
                [disabled]="tourForm.invalid || isSubmitting() || isUploadingFeatured() || isUploadingGallery() || !tourForm.get('featured_image_url')?.value">
                <span *ngIf="!isSubmitting()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {{ isEditing() ? 'Update Tour' : 'Save Tour' }}
                </span>
                <div *ngIf="isSubmitting()" class="tr-mini-spinner"></div>
              </button>
            </div>

            <!-- Validation Notice -->
            <p class="tr-notice" *ngIf="!tourForm.get('featured_image_url')?.value">
              ⚠️ A featured image must be uploaded before saving.
            </p>

          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tr-page { animation: fadeIn 0.4s ease; max-width: 1000px; margin: 0 auto; padding: 2rem 0; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    /* ── Form Wrap ── */
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

    /* ── Sections ── */
    .tr-section { padding: 1.75rem 2rem; border-bottom: 1px solid #f1f5f9; }
    .tr-section-label {
      display: flex; align-items: center; gap: 0.625rem;
      font-size: 0.8rem; font-weight: 700; color: #475569;
      text-transform: uppercase; letter-spacing: 0.07em;
      margin-bottom: 1.25rem;
    }
    .tr-section-num {
      width: 22px; height: 22px; border-radius: 50%;
      background: linear-gradient(135deg, #d4af37, #b8860b);
      color: #0f172a; font-size: 0.7rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center;
    }

    .tr-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .tr-field { display: flex; flex-direction: column; gap: 0.4rem; }
    .tr-field--span2 { grid-column: span 2; }
    .tr-label { font-size: 0.8rem; font-weight: 600; color: #475569; }
    .req { color: #ef4444; }
    .tr-input, .tr-textarea {
      padding: 0.7rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 8px;
      font-size: 0.9rem; color: #1e293b; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: #fff; font-family: inherit;
    }
    .tr-input:focus, .tr-textarea:focus, .tr-select:focus { border-color: #d4af37; box-shadow: 0 0 0 3px rgba(212,175,55,0.1); }
    .tr-textarea { resize: vertical; }
    .tr-select {
      appearance: none; cursor: pointer;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="%2364748b" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>');
      background-repeat: no-repeat; background-position: right 0.75rem center; padding-right: 2.5rem;
    }
    .tr-field-error { font-size: 0.75rem; color: #ef4444; margin: 0; }

    /* Destination Chips */
    .tr-dest-chips { display: flex; gap: 0.625rem; flex-wrap: wrap; }
    .tr-dest-chip {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.6rem 1.1rem;
      background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-size: 0.9rem; font-weight: 500; color: #475569;
      cursor: pointer; transition: all 0.2s; font-family: inherit;
    }
    .tr-dest-chip:hover { border-color: #d4af37; background: #fefce8; color: #0f172a; }
    .tr-dest-chip--active {
      background: linear-gradient(135deg, #fef9c3, #fef3c7);
      border-color: #d4af37; color: #0f172a; font-weight: 700;
      box-shadow: 0 2px 8px rgba(212,175,55,0.2);
    }

    /* Upload */
    .tr-upload-zone {
      display: flex; align-items: center; justify-content: space-between;
      background: #f8fafc; border: 1.5px dashed #e2e8f0;
      border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1rem;
      gap: 1rem;
    }
    .tr-upload-left { display: flex; align-items: center; gap: 0.875rem; flex: 1; }
    .tr-upload-icon-wrap {
      width: 40px; height: 40px; border-radius: 10px;
      background: #fff; border: 1px solid #e2e8f0;
      display: flex; align-items: center; justify-content: center; color: #94a3b8;
      flex-shrink: 0;
    }
    .tr-upload-right { display: flex; align-items: center; gap: 0.75rem; }
    .tr-upload-title { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0 0 0.2rem; }
    .tr-upload-sub { font-size: 0.75rem; color: #94a3b8; margin: 0; }
    .tr-upload-btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.55rem 1rem; background: #fff;
      border: 1px solid #e2e8f0; border-radius: 8px;
      font-size: 0.8rem; font-weight: 600; color: #475569;
      cursor: pointer; white-space: nowrap; transition: all 0.2s;
    }
    .tr-upload-btn:hover { border-color: #d4af37; color: #0f172a; }
    .tr-upload-btn.uploading { opacity: 0.7; cursor: wait; }
    .tr-img-preview {
      position: relative; width: 52px; height: 52px;
      border-radius: 8px; overflow: hidden; flex-shrink: 0;
    }
    .tr-img-preview img { width: 100%; height: 100%; object-fit: cover; }
    .tr-img-remove {
      position: absolute; top: 2px; right: 2px;
      background: rgba(0,0,0,0.6); color: #fff;
      border: none; border-radius: 50%;
      width: 16px; height: 16px; font-size: 0.55rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
    }

    /* Gallery */
    .tr-gallery-section {
      background: #f8fafc; border: 1.5px dashed #e2e8f0;
      border-radius: 12px; padding: 1rem 1.25rem;
    }
    .tr-gallery-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.875rem; }
    .tr-gallery-grid { display: flex; flex-wrap: wrap; gap: 0.625rem; }
    .tr-gallery-item {
      position: relative; width: 72px; height: 72px;
      border-radius: 10px; overflow: hidden;
      border: 2px solid #e2e8f0;
    }
    .tr-gallery-item img { width: 100%; height: 100%; object-fit: cover; }
    .tr-gallery-remove {
      position: absolute; top: 3px; right: 3px;
      background: rgba(0,0,0,0.6); color: #fff;
      border: none; border-radius: 50%;
      width: 18px; height: 18px; font-size: 0.6rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
    }

    /* Included / Excluded */
    .tr-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .tr-list-block { border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .tr-list-block--green .tr-list-header { background: #f0fdf4; border-bottom: 1px solid #bbf7d0; }
    .tr-list-block--red .tr-list-header { background: #fff1f2; border-bottom: 1px solid #fecdd3; }
    .tr-list-header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; }
    .tr-list-title { font-size: 0.825rem; font-weight: 700; color: #374151; }
    .tr-list-add {
      background: transparent; border: 1px solid #d1d5db;
      color: #374151; font-size: 0.75rem; font-weight: 600;
      padding: 0.25rem 0.6rem; border-radius: 6px; cursor: pointer;
      transition: all 0.2s;
    }
    .tr-list-add:hover { border-color: #6b7280; background: #fff; }
    .tr-list-items { padding: 0.625rem; display: flex; flex-direction: column; gap: 0.5rem; background: #fff; }
    .tr-list-row { display: flex; gap: 0.4rem; align-items: center; }
    .tr-list-input {
      flex: 1; padding: 0.5rem 0.7rem; border: 1px solid #e2e8f0;
      border-radius: 6px; font-size: 0.85rem; color: #1e293b;
      outline: none; font-family: inherit;
    }
    .tr-list-input:focus { border-color: #d4af37; }
    .tr-list-remove {
      width: 26px; height: 26px; border: none;
      background: #fee2e2; color: #ef4444; border-radius: 6px;
      font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.2s;
    }
    .tr-list-remove:hover { background: #fecaca; }

    /* Highlights */
    .tr-highlights-list { display: flex; flex-direction: column; gap: 0.625rem; }
    .tr-highlight-row { display: flex; align-items: center; gap: 0.625rem; }
    .tr-highlight-num {
      width: 26px; height: 26px; border-radius: 50%;
      background: #f1f5f9; color: #64748b;
      font-size: 0.75rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .tr-add-item-btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: transparent; border: 1.5px dashed #cbd5e1;
      color: #64748b; font-size: 0.8rem; font-weight: 500;
      padding: 0.55rem 1rem; border-radius: 8px;
      cursor: pointer; transition: all 0.2s; font-family: inherit;
      margin-top: 0.25rem; width: 100%; justify-content: center;
    }
    .tr-add-item-btn:hover { border-color: #d4af37; color: #0f172a; background: #fefce8; }

    /* Tour Plan */
    .tr-plan-list { display: flex; flex-direction: column; gap: 1rem; }
    .tr-day-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .tr-day-header {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.875rem 1.125rem;
      background: linear-gradient(135deg, #0f172a, #1e293b);
    }
    .tr-day-badge {
      background: linear-gradient(135deg, #d4af37, #b8860b);
      color: #0f172a; font-size: 0.7rem; font-weight: 800;
      padding: 0.25rem 0.625rem; border-radius: 6px;
      white-space: nowrap; flex-shrink: 0;
    }
    .tr-day-title-input {
      flex: 1; background: rgba(255,255,255,0.1) !important;
      border-color: rgba(255,255,255,0.1) !important; color: #f1f5f9 !important;
    }
    .tr-day-title-input::placeholder { color: #64748b; }
    .tr-day-title-input:focus { border-color: rgba(212,175,55,0.5) !important; box-shadow: none !important; }
    .tr-day-remove {
      width: 28px; height: 28px; border: none;
      background: rgba(239,68,68,0.2); color: #f87171; border-radius: 6px;
      font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.2s;
    }
    .tr-day-remove:hover { background: rgba(239,68,68,0.4); }
    .tr-day-activities { padding: 1rem 1.125rem; display: flex; flex-direction: column; gap: 0.875rem; }
    .tr-activity-row { display: flex; gap: 0.625rem; align-items: flex-start; }
    .tr-activity-fields { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
    .tr-activity-headline { font-size: 0.85rem; }
    .tr-activity-details { font-size: 0.85rem; }
    .tr-add-activity-btn {
      display: inline-flex; align-items: center; gap: 0.35rem;
      background: transparent; border: 1px dashed #cbd5e1;
      color: #64748b; font-size: 0.75rem; font-weight: 500;
      padding: 0.45rem 0.875rem; border-radius: 7px;
      cursor: pointer; font-family: inherit; transition: all 0.2s;
    }
    .tr-add-activity-btn:hover { border-color: #d4af37; color: #0f172a; }

    /* Actions */
    .tr-form-actions {
      display: flex; justify-content: flex-end; gap: 0.75rem;
      padding: 1.5rem 2rem; background: #f8fafc;
      border-top: 1px solid #e2e8f0;
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
      padding: 0.7rem 1.75rem;
      background: linear-gradient(135deg, #d4af37, #b8860b);
      border: none; border-radius: 10px;
      color: #0f172a; font-size: 0.875rem; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(212,175,55,0.25);
      min-width: 130px; justify-content: center;
    }
    .tr-btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212,175,55,0.35); }
    .tr-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .tr-notice { text-align: center; font-size: 0.78rem; color: #f59e0b; padding: 0.5rem 2rem 1rem; margin: 0; }
    .tr-mini-spinner { width: 16px; height: 16px; border: 2px solid rgba(15,23,42,0.25); border-top-color: #0f172a; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AdminTourFormComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  fetchedCategories = signal<any[]>([]);
  isSubmitting = signal(false);
  isEditing = signal(false);
  editingId = signal<string | null>(null);

  isUploadingFeatured = signal(false);
  featuredPreview = signal('');

  isUploadingGallery = signal(false);
  galleryUrls = signal<string[]>([]);
  galleryUploadProgress = signal('');

  destinations = [
    { value: 'giza',  label: 'Giza',  icon: '🏛️' },
    { value: 'luxor', label: 'Luxor', icon: '⛵' },
    { value: 'aswan', label: 'Aswan', icon: '🌅' },
  ];

  tourForm: FormGroup = this.fb.group({
    title:          ['', Validators.required],
    tagline:        ['', Validators.required],
    description:    ['', Validators.required],
    destination:    ['', Validators.required],
    category:       ['', Validators.required],
    city:           ['', Validators.required],
    duration:       [1,  [Validators.required, Validators.min(1)]],
    duration_type:  ['Days', Validators.required],
    max_group_size: [10, [Validators.required, Validators.min(1)]],
    featured_image_url: ['', Validators.required],
    tour_type:      ['standard', Validators.required],
    sub_type:       ['standard', Validators.required],
    included:    this.fb.array([this.fb.control('Guide')]),
    excluded:    this.fb.array([this.fb.control('Personal expenses')]),
    highlights:  this.fb.array([this.fb.control('')]),
    tours_plan:  this.fb.array([this.createDay()])
  });

  get includedArray()   { return this.tourForm.get('included')   as FormArray; }
  get excludedArray()   { return this.tourForm.get('excluded')   as FormArray; }
  get highlightsArray() { return this.tourForm.get('highlights') as FormArray; }
  get toursPlanArray()  { return this.tourForm.get('tours_plan') as FormArray; }

  getDayActivities(dayIndex: number): FormArray {
    return (this.toursPlanArray.at(dayIndex) as FormGroup).get('description') as FormArray;
  }

  createDay(): FormGroup {
    const nextDay = (this.tourForm && this.toursPlanArray) ? this.toursPlanArray.length + 1 : 1;
    return this.fb.group({
      day:         [nextDay],
      title:       ['', Validators.required],
      description: this.fb.array([this.createActivity()])
    });
  }

  createActivity(): FormGroup {
    return this.fb.group({ headline: [''], details: [''] });
  }

  ngOnInit() {
    this.loadCategories();
    
    // Check if we are editing
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing.set(true);
      this.editingId.set(id);
      const tourState = history.state.tour;
      if (tourState) {
        this.populateForm(tourState);
      } else {
        // Fallback: If refreshed on edit page without state, go back to tours
        this.notification.showError('Tour data not found. Please select a tour from the list.');
        this.router.navigate(['/admin/dashboard/tours']);
      }
    }
  }

  loadCategories() {
    this.adminApi.getCategories().subscribe({
      next: (res) => this.fetchedCategories.set(res.data?.data || res.data || []),
      error: () => console.error('Failed to load categories')
    });
  }

  selectDestination(value: string) {
    this.tourForm.patchValue({ destination: value });
    this.tourForm.get('destination')?.markAsTouched();
  }

  populateForm(tour: any) {
    // 1. Basic fields
    this.tourForm.patchValue({
      title: tour.title,
      tagline: tour.tagline,
      description: tour.description,
      destination: tour.destination,
      category: tour.category?._id || tour.category,
      city: tour.city,
      duration: tour.duration || tour.duration_days,
      duration_type: tour.duration_type || 'Days',
      max_group_size: tour.max_group_size,
      featured_image_url: tour.featured_image_url,
      tour_type: tour.tour_type || 'standard',
      sub_type: tour.sub_type || 'standard'
    });

    this.featuredPreview.set(tour.featured_image_url || '');

    if (tour.gallery_urls && tour.gallery_urls.length > 0) {
      this.galleryUrls.set(tour.gallery_urls);
    }

    // 2. Clear default arrays
    while(this.includedArray.length) this.includedArray.removeAt(0);
    while(this.excludedArray.length) this.excludedArray.removeAt(0);
    while(this.highlightsArray.length) this.highlightsArray.removeAt(0);
    while(this.toursPlanArray.length) this.toursPlanArray.removeAt(0);

    // 3. Populate Arrays
    if (tour.included?.length) {
      tour.included.forEach((item: string) => this.includedArray.push(this.fb.control(item)));
    } else {
      this.addIncluded(); // Default empty
    }

    if (tour.excluded?.length) {
      tour.excluded.forEach((item: string) => this.excludedArray.push(this.fb.control(item)));
    } else {
      this.addExcluded();
    }

    if (tour.highlights?.length) {
      tour.highlights.forEach((item: string) => this.highlightsArray.push(this.fb.control(item)));
    } else {
      this.addHighlight();
    }

    if (tour.tours_plan?.length) {
      tour.tours_plan.forEach((day: any) => {
        const dayGroup = this.fb.group({
          day: [day.day],
          title: [day.title, Validators.required],
          description: this.fb.array([])
        });
        const actsArray = dayGroup.get('description') as FormArray;
        if (day.description?.length) {
          day.description.forEach((act: any) => {
            actsArray.push(this.fb.group({
              headline: [act.headline],
              details: [act.details]
            }));
          });
        } else {
          actsArray.push(this.createActivity());
        }
        this.toursPlanArray.push(dayGroup);
      });
    } else {
      this.addDay();
    }
  }

  goBack() {
    this.router.navigate(['/admin/dashboard/tours']);
  }

  // -- Included --
  addIncluded() { this.includedArray.push(this.fb.control('')); }
  removeIncluded(index: number) { this.includedArray.removeAt(index); }
  // -- Excluded --
  addExcluded() { this.excludedArray.push(this.fb.control('')); }
  removeExcluded(index: number) { this.excludedArray.removeAt(index); }
  // -- Highlights --
  addHighlight() { this.highlightsArray.push(this.fb.control('')); }
  removeHighlight(index: number) { this.highlightsArray.removeAt(index); }
  // -- Plan --
  addDay() { this.toursPlanArray.push(this.createDay()); }
  removeDay(index: number) { this.toursPlanArray.removeAt(index); }
  addActivity(dayIndex: number) { this.getDayActivities(dayIndex).push(this.createActivity()); }
  removeActivity(dayIndex: number, actIndex: number) { this.getDayActivities(dayIndex).removeAt(actIndex); }

  onFeaturedSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    this.isUploadingFeatured.set(true);
    this.adminApi.uploadImage(file).subscribe({
      next: (res) => {
        const url = res.url || res.data?.url;
        this.featuredPreview.set(url);
        this.tourForm.patchValue({ featured_image_url: url });
        this.isUploadingFeatured.set(false);
        this.notification.showSuccess('Featured image uploaded');
      },
      error: () => {
        this.isUploadingFeatured.set(false);
        this.notification.showError('Failed to upload image');
      }
    });
  }

  onGallerySelected(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    this.isUploadingGallery.set(true);
    let uploadedCount = 0;
    const totalFiles = files.length;
    this.galleryUploadProgress.set(`0/${totalFiles}`);

    Array.from(files).forEach((file: any) => {
      this.adminApi.uploadImage(file).subscribe({
        next: (res) => {
          const url = res.url || res.data?.url;
          this.galleryUrls.update(urls => [...urls, url]);
          uploadedCount++;
          this.galleryUploadProgress.set(`${uploadedCount}/${totalFiles}`);
          if (uploadedCount === totalFiles) {
            this.isUploadingGallery.set(false);
            this.notification.showSuccess(`Uploaded ${totalFiles} gallery image(s)`);
          }
        },
        error: () => {
          uploadedCount++;
          if (uploadedCount === totalFiles) {
            this.isUploadingGallery.set(false);
          }
          this.notification.showError('Failed to upload some gallery images');
        }
      });
    });
  }

  removeGalleryImage(index: number) {
    this.galleryUrls.update(urls => urls.filter((_, i) => i !== index));
  }

  onSubmit() {
    if (this.tourForm.invalid) {
      this.tourForm.markAllAsTouched();
      this.notification.showError('Please fill all required fields correctly');
      return;
    }

    const formData = this.tourForm.value;
    formData.gallery_urls = this.galleryUrls();
    // Default price to 0 if not set in UI, to avoid backend error
    if (!formData.price_usd) formData.price_usd = 0;

    this.isSubmitting.set(true);

    if (this.isEditing() && this.editingId()) {
      this.adminApi.updateTour(this.editingId()!, formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notification.showSuccess('Tour updated successfully');
          this.router.navigate(['/admin/dashboard/tours']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting.set(false);
          this.notification.showError(err.error?.message || 'Failed to update tour');
        }
      });
    } else {
      this.adminApi.createTour(formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notification.showSuccess('Tour created successfully');
          this.router.navigate(['/admin/dashboard/tours']);
        },
        error: (err) => {
          console.error(err);
          this.isSubmitting.set(false);
          this.notification.showError(err.error?.message || 'Failed to create tour');
        }
      });
    }
  }
}
