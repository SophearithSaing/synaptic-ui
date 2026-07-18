import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SynInputAutocomplete, SynInputType } from '../models/input.model';

@Component({
  selector: 'syn-input',
  imports: [NgClass],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './input.component.scss',
})
export class SynInputComponent implements OnChanges {
  @Input() public autocomplete: SynInputAutocomplete | null = null;

  @Input({ transform: booleanAttribute }) public error = false;

  @Input() public icon: string | null = null;

  @Input({ required: true }) public inputId = '';

  @Input({ required: true }) public name = '';

  @Input() public placeholder = '';

  @Input({ transform: booleanAttribute }) public required = false;

  @Input() public type: SynInputType = 'text';

  @Input() public value = '';

  @Output() public readonly valueChange = new EventEmitter<string>();

  public inputClasses: Record<string, boolean> = this.createInputClasses();

  /**
   * Updates input classes when inputs change.
   */
  public ngOnChanges(): void {
    this.inputClasses = this.createInputClasses();
  }

  /**
   * Emits the current input value when it changes.
   *
   * @param event Native input event.
   */
  public onInput(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.valueChange.emit(target.value);
  }

  /**
   * Builds state classes for the rendered input.
   *
   * @returns Input class map keyed by CSS class name.
   */
  private createInputClasses(): Record<string, boolean> {
    return {
      'input--error': this.error,
      'input--icon': !!this.icon,
    };
  }
}
