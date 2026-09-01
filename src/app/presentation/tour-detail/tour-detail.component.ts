import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GetTourBySlugUseCase } from '../../domain/use-cases/get-tour-by-slug.usecase';
import { Tour } from '../../domain/models/tour.model';
import { TourApiService } from '../../data/services/tour-api.service';
import { InquiryApiService } from '../../data/services/inquiry-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.scss',
})
export class TourDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly getTourBySlug = inject(GetTourBySlugUseCase);
  private readonly tourApiService = inject(TourApiService);
  private readonly inquiryService = inject(InquiryApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly seoService = inject(SeoService);

  readonly tour = signal<Tour | null>(null);
  readonly loading = signal<boolean>(true);
  readonly galleryIndex = signal<number>(0);

  isLandscape = signal<boolean>(true);

  onMainImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    const ratio = img.naturalWidth / img.naturalHeight;

    this.isLandscape.set(ratio >= 1.05);
  }
  openAccordionIndex: number = 0; // Default first item open
  Math = Math; // Expose Math to template

  // --- Review Form State ---
  reviews = signal<any[]>([]);
  reviewName = signal<string>('');
  reviewRating = signal<number>(5);
  reviewComment = signal<string>('');
  isSubmittingReview = signal<boolean>(false);
  reviewSubmitSuccess = signal<boolean>(false);
  reviewSubmitError = signal<string>('');

  // Slider State
  currentReviewIndex = signal<number>(0);

  setRating(rating: number) {
    this.reviewRating.set(rating);
  }

  nextReview() {
    if (this.reviews().length > 0) {
      this.currentReviewIndex.update(i => (i + 1) % this.reviews().length);
    }
  }

  prevReview() {
    if (this.reviews().length > 0) {
      this.currentReviewIndex.update(i => (i - 1 + this.reviews().length) % this.reviews().length);
    }
  }

  setReviewPage(index: number) {
    this.currentReviewIndex.set(index);
  }

  submitReview() {
    const tourId = this.tour()?.id;
    if (!tourId) return;

    if (!this.reviewName() || !this.reviewComment()) {
      this.reviewSubmitError.set('Please provide both name and comment.');
      return;
    }

    this.isSubmittingReview.set(true);
    this.reviewSubmitError.set('');
    this.reviewSubmitSuccess.set(false);

    this.tourApiService.addAnonymousReview(tourId, this.reviewName(), this.reviewRating(), this.reviewComment())
      .subscribe({
        next: (res) => {
          this.isSubmittingReview.set(false);
          this.reviewSubmitSuccess.set(true);

          // Append the new review to the list
          if (res.data) {
            this.reviews.update(r => [...r, res.data]);
            // Optional: jump to the latest review (last index)
            this.currentReviewIndex.set(this.reviews().length - 1);
          }

          // Reset form
          this.reviewName.set('');
          this.reviewRating.set(5);
          this.reviewComment.set('');
        },
        error: (err) => {
          this.isSubmittingReview.set(false);
          this.reviewSubmitError.set('Failed to submit review. Please try again later.');
          console.error(err);
        }
      });
  }

  // --- Form State from Contact Page ---
  countries = [
    { name: 'United States', dialCode: '+1' },
    { name: 'United Kingdom', dialCode: '+44' },
    { name: 'Canada', dialCode: '+1' },
    { name: 'Australia', dialCode: '+61' },
    { name: 'Germany', dialCode: '+49' },
    { name: 'France', dialCode: '+33' },
    { name: 'Italy', dialCode: '+39' },
    { name: 'Spain', dialCode: '+34' },
    { name: 'Brazil', dialCode: '+55' },
    { name: 'India', dialCode: '+91' },
    { name: 'China', dialCode: '+86' },
    { name: 'Japan', dialCode: '+81' },
    { name: 'South Africa', dialCode: '+27' },
    { name: 'Egypt', dialCode: '+20' },
    { name: 'United Arab Emirates', dialCode: '+971' },
    { name: 'Saudi Arabia', dialCode: '+966' },
    { name: 'Netherlands', dialCode: '+31' },
    { name: 'Switzerland', dialCode: '+41' },
    { name: 'Sweden', dialCode: '+46' },
    { name: 'Norway', dialCode: '+47' },
    { name: 'Denmark', dialCode: '+45' },
    { name: 'Finland', dialCode: '+358' },
    { name: 'New Zealand', dialCode: '+64' },
    { name: 'Mexico', dialCode: '+52' },
    { name: 'Argentina', dialCode: '+54' },
    { name: 'Russia', dialCode: '+7' },
    { name: 'Turkey', dialCode: '+90' },
    { name: 'Greece', dialCode: '+30' },
    { name: 'Portugal', dialCode: '+351' },
    { name: 'Ireland', dialCode: '+353' },
    { name: 'Belgium', dialCode: '+32' },
    { name: 'Austria', dialCode: '+43' },
    { name: 'Singapore', dialCode: '+65' },
    { name: 'Malaysia', dialCode: '+60' },
    { name: 'Thailand', dialCode: '+66' },
    { name: 'Indonesia', dialCode: '+62' },
    { name: 'Philippines', dialCode: '+63' },
    { name: 'Vietnam', dialCode: '+84' },
    { name: 'South Korea', dialCode: '+82' },
    { name: 'Other', dialCode: '' }
  ];

  isCountryDropdownOpen = signal<boolean>(false);
  isCodeDropdownOpen = signal<boolean>(false);
  isDateFromOpen = signal<boolean>(false);
  isDateToOpen = signal<boolean>(false);

  selectedCountry = signal<string>('');
  selectedCode = signal<string>('+1');
  selectedDateFrom = signal<Date | null>(null);
  selectedDateTo = signal<Date | null>(null);

  currentMonth = signal<number>(new Date().getMonth());
  currentYear = signal<number>(new Date().getFullYear());
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  get currentMonthName(): string {
    return this.monthNames[this.currentMonth()];
  }

  get calendarDays(): (number | null)[] {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }

  nextMonth() {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(y => y + 1);
    } else {
      this.currentMonth.update(m => m + 1);
    }
  }

  prevMonth() {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(y => y - 1);
    } else {
      this.currentMonth.update(m => m - 1);
    }
  }

  toggleDateFrom() {
    this.isDateFromOpen.update(v => !v);
    this.isDateToOpen.set(false);
    this.closeOtherDropdowns();
  }

  toggleDateTo() {
    this.isDateToOpen.update(v => !v);
    this.isDateFromOpen.set(false);
    this.closeOtherDropdowns();
  }

  selectDate(day: number, isFrom: boolean) {
    const selected = new Date(this.currentYear(), this.currentMonth(), day);
    if (isFrom) {
      this.selectedDateFrom.set(selected);
      this.isDateFromOpen.set(false);
    } else {
      this.selectedDateTo.set(selected);
      this.isDateToOpen.set(false);
    }
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${m}/${d}/${y}`;
  }

  closeOtherDropdowns() {
    this.isCountryDropdownOpen.set(false);
    this.isCodeDropdownOpen.set(false);
  }

  toggleCountryDropdown() {
    this.isCountryDropdownOpen.update(v => !v);
    this.isCodeDropdownOpen.set(false);
    this.isDateFromOpen.set(false);
    this.isDateToOpen.set(false);
  }

  toggleCodeDropdown() {
    this.isCodeDropdownOpen.update(v => !v);
    this.isCountryDropdownOpen.set(false);
    this.isDateFromOpen.set(false);
    this.isDateToOpen.set(false);
  }

  selectCountry(name: string) {
    this.selectedCountry.set(name);
    this.isCountryDropdownOpen.set(false);
  }

  selectCode(code: string) {
    this.selectedCode.set(code);
    this.isCodeDropdownOpen.set(false);
  }

  closeDropdowns() {
    this.isCountryDropdownOpen.set(false);
    this.isCodeDropdownOpen.set(false);
    this.isDateFromOpen.set(false);
    this.isDateToOpen.set(false);
  }

  toggleAccordion(index: number): void {
    if (this.openAccordionIndex === index) {
      this.openAccordionIndex = -1;
    } else {
      this.openAccordionIndex = index;
    }
  }

  // --- Inquiry Form ---
  inquiryFormData: {
    fullName: string;
    email: string;
    phone: string;
    adults: number | null;
    children: number | null;
    message: string;
  } = {
    fullName: '',
    email: '',
    phone: '',
    adults: null,
    children: null,
    message: ''
  };

  isInquirySubmitting = signal<boolean>(false);

  formatDateISO(date: Date | null): string | undefined {
    if (!date) return undefined;
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  submitInquiry(): void {
    if (!this.inquiryFormData.fullName || !this.inquiryFormData.email) {
      this.notificationService.showError('Please provide your name and email address.');
      return;
    }

    this.isInquirySubmitting.set(true);

    const payload = {
      fullName: this.inquiryFormData.fullName,
      email: this.inquiryFormData.email,
      phoneCountryCode: this.selectedCode(),
      phone: this.inquiryFormData.phone,
      nationality: this.selectedCountry(),
      travelDateFrom: this.selectedDateFrom() ? this.formatDateISO(this.selectedDateFrom()) : undefined,
      travelDateTo: this.selectedDateTo() ? this.formatDateISO(this.selectedDateTo()) : undefined,
      adults: this.inquiryFormData.adults ?? undefined,
      children: this.inquiryFormData.children ?? undefined,
      message: this.inquiryFormData.message,
      tourTitle: this.tour()?.title,
      tourSlug: this.tour()?.slug,
    };

    this.inquiryService.submit(payload).subscribe({
      next: () => {
        this.isInquirySubmitting.set(false);
        this.notificationService.showSuccess('Your private inquiry has been received by our senior concierge.');
        // Reset form
        this.inquiryFormData = {
          fullName: '', email: '', phone: '', adults: null, children: null, message: ''
        };
        this.selectedDateFrom.set(null);
        this.selectedDateTo.set(null);
        this.selectedCountry.set('');
        this.selectedCode.set('+1');
      },
      error: (err) => {
        this.isInquirySubmitting.set(false);
        console.error('Inquiry submission failed:', err);
        this.notificationService.showError('Failed to send inquiry. Please try again later.');
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchTourDetails(slug);
      }
    });
  }

  private fetchTourDetails(slug: string): void {
    this.loading.set(true);
    this.getTourBySlug.execute(slug).subscribe({
      next: (tour) => {
        this.tour.set(tour);
        this.galleryIndex.set(0);

        // ── Dynamic SEO ──────────────────────────────────────
        if (tour) {
          const description = (tour as any).shortDescription
            || (tour.description ? String(tour.description).replace(/<[^>]*>/g, '').slice(0, 160) : '')
            || `Explore the ${tour.title} tour with Kemetica — luxury, private, Egyptologist-guided.`;

          this.seoService.updateSeo({
            title: `${tour.title} — Kemetica`,
            description,
            image: tour.featuredImage || 'https://www.kemetica.com/bac-img.png',
            imageAlt: tour.title,
            type: 'article',
            canonical: `https://www.kemetica.com/tours/${tour.slug}`,
          });

          // ── JSON-LD: TourPackage schema ──────────────────────
          this.seoService.addJsonLd({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: tour.title,
            description,
            image: tour.featuredImage,
            url: `https://www.kemetica.com/tours/${tour.slug}`,
            brand: {
              '@type': 'Organization',
              name: 'Kemetica',
              url: 'https://www.kemetica.com',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: (tour as any).price ?? undefined,
              availability: 'https://schema.org/InStock',
              url: `https://www.kemetica.com/tours/${tour.slug}`,
            },
          });
        }
        // ────────────────────────────────────────────────────

        if (tour && tour.id) {
          this.fetchReviews(tour.id);
        } else {
          this.loading.set(false);
        }
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    // Remove JSON-LD when navigating away
    this.seoService.removeJsonLd();
  }

  private fetchReviews(tourId: string): void {
    this.tourApiService.getReviews(tourId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews || []);
        this.currentReviewIndex.set(0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  // --- Gallery Logic ---
  get allImages(): string[] {
    const t = this.tour();
    if (!t) return [];
    return [t.featuredImage, ...(t.galleryImages || [])];
  }

  nextImage(): void {
    const images = this.allImages;
    if (images.length === 0) return;
    this.galleryIndex.update(i => (i + 1) % images.length);

    this.isLandscape.set(true);
  }

  prevImage(): void {
    const images = this.allImages;
    if (images.length === 0) return;
    this.galleryIndex.update(i => (i - 1 + images.length) % images.length);

    this.isLandscape.set(true);
  }

  setGalleryImage(index: number): void {
    this.galleryIndex.set(index);
    this.isLandscape.set(true);

  }
}
