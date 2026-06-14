import { Component, Input } from '@angular/core';

import { SynChipTone } from '../models/chip.model';

@Component({
  selector: 'syn-chip',
  standalone: true,
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class SynChipComponent {
  @Input({ required: true }) public label = '';

  @Input() public tone: SynChipTone = 'default';

  /**
   * Returns whether the chip uses the requested tone.
   *
   * @param tone Tone to compare.
   * @returns True when the requested tone matches the chip tone.
   */
  public hasTone(tone: SynChipTone): boolean {
    return this.tone === tone;
  }
}
