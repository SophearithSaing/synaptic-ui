import { NgClass } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

import { SynChipTone } from '../models/chip.model';

@Component({
  selector: 'syn-chip',
  imports: [NgClass],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class SynChipComponent implements OnChanges {
  @Input({ required: true }) public label = '';

  @Input() public tone: SynChipTone = 'default';

  public chipClasses: Record<string, boolean> = this.createChipClasses();

  /**
   * Updates chip classes when inputs change.
   */
  public ngOnChanges(): void {
    this.chipClasses = this.createChipClasses();
  }

  /**
   * Builds tone classes for the rendered chip.
   *
   * @returns Chip class map keyed by CSS class name.
   */
  private createChipClasses(): Record<string, boolean> {
    return {
      'chip--primary': this.tone === 'primary',
      'chip--outline': this.tone === 'outline',
      'chip--error': this.tone === 'error',
    };
  }
}
