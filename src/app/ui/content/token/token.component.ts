import { Component, Input } from '@angular/core';

import { SynTokenTone } from '../models/token.model';

@Component({
  selector: 'syn-token',
  standalone: true,
  templateUrl: './token.component.html',
  styleUrl: './token.component.scss',
})
export class SynTokenComponent {
  @Input({ required: true }) public label = '';

  @Input() public tone: SynTokenTone = 'primary';

  /**
   * Returns whether the token uses the requested tone.
   *
   * @param tone Tone to compare.
   * @returns True when the requested tone matches the token tone.
   */
  public hasTone(tone: SynTokenTone): boolean {
    return this.tone === tone;
  }
}
