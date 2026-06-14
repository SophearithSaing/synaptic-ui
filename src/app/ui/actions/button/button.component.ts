import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SynButtonType, SynButtonVariant } from '../models/button.model';

@Component({
  selector: 'syn-button',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class SynButtonComponent implements OnChanges {
  @Input({ transform: booleanAttribute }) public disabled = false;

  @Input() public href: string | null = null;

  @Input() public icon: string | null = null;

  @Input() public label = '';

  @Input() public routerLink: string | null = null;

  @Input() public type: SynButtonType = 'button';

  @Input() public variant: SynButtonVariant = 'primary';

  @Output() public readonly buttonClick = new EventEmitter<void>();

  public buttonClasses: Record<string, boolean> = this.createButtonClasses();

  /**
   * Updates button classes when inputs change.
   */
  public ngOnChanges(): void {
    this.buttonClasses = this.createButtonClasses();
  }

  /**
   * Emits when the button is selected and not disabled.
   */
  public onClick(): void {
    if (this.disabled) {
      return;
    }

    this.buttonClick.emit();
  }

  /**
   * Builds variant and state classes for the rendered button element.
   *
   * @returns Button class map keyed by CSS class name.
   */
  private createButtonClasses(): Record<string, boolean> {
    return {
      'button--primary': this.variant === 'primary',
      'button--secondary': this.variant === 'secondary',
      'button--ghost': this.variant === 'ghost',
      'button--disabled': this.disabled,
    };
  }
}
