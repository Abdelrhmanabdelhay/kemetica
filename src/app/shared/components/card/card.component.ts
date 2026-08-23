import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [ngClass]="[
        'rounded-2xl border transition-all duration-300',
        glass ? 'glass-panel' : 'bg-slate-900 border-slate-800',
        hoverable ? 'hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1' : '',
        paddingClasses[padding],
        customClass
      ]"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input() glass: boolean = true;
  @Input() hoverable: boolean = true;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() customClass: string = '';

  readonly paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
}
