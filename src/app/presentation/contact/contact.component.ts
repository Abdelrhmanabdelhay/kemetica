import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { NotificationService } from '../../core/services/notification.service';
import { InquiryApiService } from '../../data/services/inquiry-api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly inquiryService = inject(InquiryApiService);

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

  // Calendar State
  currentMonth = signal<number>(new Date().getMonth());
  currentYear = signal<number>(new Date().getFullYear());
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  get currentMonthName(): string {
    return this.monthNames[this.currentMonth()];
  }

  // Generate calendar days
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

  formData: {
    fullName: string;
    email: string;
    phone: string;
    expeditionType: string;
    estimatedGuests: number | null;
    children: number | null;
    travelDates: string;
    specialRequests: string;
  } = {
    fullName: '',
    email: '',
    phone: '',
    expeditionType: 'luxury-nile',
    estimatedGuests: null,
    children: null,
    travelDates: '',
    specialRequests: '',
  };

  isSubmitting = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);

  onSubmit(): void {
    if (!this.formData.fullName || !this.formData.email) {
      this.notificationService.showError('Please provide your name and email address.');
      return;
    }

    this.isSubmitting.set(true);

    const payload = {
      fullName: this.formData.fullName,
      email: this.formData.email,
      phoneCountryCode: this.selectedCode(),
      phone: this.formData.phone,
      nationality: this.selectedCountry(),
      travelDateFrom: this.selectedDateFrom() ? this.formatDateISO(this.selectedDateFrom()) : undefined,
      travelDateTo: this.selectedDateTo() ? this.formatDateISO(this.selectedDateTo()) : undefined,
      adults: this.formData.estimatedGuests ?? undefined,
      children: this.formData.children ?? undefined,
      message: `Expedition Type: ${this.formData.expeditionType}\n\nSpecial Requests: ${this.formData.specialRequests}`
    };

    this.inquiryService.submit(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSubmitted.set(true);
        this.notificationService.showSuccess('Your private inquiry has been received by our senior concierge.');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Inquiry submission failed:', err);
        this.notificationService.showError('Failed to send inquiry. Please try again later.');
      }
    });
  }

  formatDateISO(date: Date | null): string | undefined {
    if (!date) return undefined;
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
