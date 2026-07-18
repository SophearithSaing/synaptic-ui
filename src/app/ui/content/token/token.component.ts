import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SynTokenTone } from '../models/token.model';

@Component({
  selector: 'syn-token',
  imports: [NgClass],
  templateUrl: './token.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './token.component.scss',
})
export class SynTokenComponent implements OnChanges {
  @Input({ required: true }) public label = '';

  @Input() public tone: SynTokenTone = 'primary';

  public tokenClasses: Record<string, boolean> = this.createTokenClasses();

  /**
   * Updates token classes when inputs change.
   */
  public ngOnChanges(): void {
    this.tokenClasses = this.createTokenClasses();
  }

  /**
   * Builds tone classes for the rendered token.
   *
   * @returns Token class map keyed by CSS class name.
   */
  private createTokenClasses(): Record<string, boolean> {
    return {
      'token--primary': this.tone === 'primary',
      'token--secondary': this.tone === 'secondary',
      'token--outline': this.tone === 'outline',
      'token--error': this.tone === 'error',
    };
  }
}
