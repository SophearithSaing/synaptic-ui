import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

import { SynOptionType } from '../models/option.model';

@Component({
  selector: 'syn-option',
  standalone: true,
  imports: [NgClass],
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
})
export class SynOptionComponent implements OnChanges {
  @Input({ required: true }) public label = '';

  @Input({ required: true }) public name = '';

  @Input({ transform: booleanAttribute }) public selected = false;

  @Input() public type: SynOptionType = 'radio';

  @Input() public value = '';

  @Output() public readonly selectedChange = new EventEmitter<boolean>();

  public optionClasses: Record<string, boolean> = this.createOptionClasses();

  /**
   * Updates option classes when inputs change.
   */
  public ngOnChanges(): void {
    this.optionClasses = this.createOptionClasses();
  }

  /**
   * Emits the selected state when the option changes.
   *
   * @param event Native option input event.
   */
  public onChange(event: Event): void {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.selectedChange.emit(target.checked);
  }

  /**
   * Builds state classes for the rendered option.
   *
   * @returns Option class map keyed by CSS class name.
   */
  private createOptionClasses(): Record<string, boolean> {
    return {
      'option--selected': this.selected,
    };
  }
}
