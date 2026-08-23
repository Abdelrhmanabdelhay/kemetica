import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'gold' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
      [ngClass]="[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        customClass,
        disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
      ]"
    >
      <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() customClass: string = '';
  @Output() onClick = new EventEmitter<MouseEvent>();

  readonly baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary-gold focus:ring-offset-2 focus:ring-offset-bg-sand';

  readonly variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-secondary-gold hover:bg-gold-hover text-pure-white shadow-lg shadow-secondary-gold/20 hover:shadow-secondary-gold/40',
    gold: 'bg-gradient-to-r from-secondary-gold via-gold-hover to-yellow-500 text-pure-white shadow-lg shadow-secondary-gold/30 hover:scale-[1.02]',
    secondary: 'bg-primary-blue hover:bg-primary-blue/90 text-pure-white border border-primary-blue',
    outline: 'border border-secondary-gold/40 text-secondary-gold hover:bg-secondary-gold/10 hover:border-secondary-gold',
    ghost: 'text-text-dark hover:text-secondary-gold hover:bg-black/5',
  };

  readonly sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };
}
