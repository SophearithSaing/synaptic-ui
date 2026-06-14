import { Component, Input, OnChanges } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'syn-form-field',
  standalone: true,
  imports: [NgClass],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class SynFormFieldComponent implements OnChanges {
  @Input() public error: string | null = null;

  @Input() public forId: string | null = null;

  @Input() public hint: string | null = null;

  @Input({ required: true }) public label = '';

  public fieldClasses: Record<string, boolean> = this.createFieldClasses();

  /**
   * Updates field classes when inputs change.
   */
  public ngOnChanges(): void {
    this.fieldClasses = this.createFieldClasses();
  }

  /**
   * Returns the visible helper text for the field.
   *
   * @returns Error text when present, otherwise hint text.
   */
  public helperText(): string | null {
    return this.error ?? this.hint;
  }

  /**
   * Builds state classes for the rendered form field.
   *
   * @returns Form field class map keyed by CSS class name.
   */
  private createFieldClasses(): Record<string, boolean> {
    return {
      'form-field--error': !!this.error,
    };
  }
}
