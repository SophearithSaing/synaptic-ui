import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

interface InlineCodeSegment {
  readonly code: boolean;
  readonly text: string;
}

@Component({
  selector: 'syn-inline-code-text',
  standalone: true,
  templateUrl: './inline-code-text.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './inline-code-text.component.scss',
})
export class SynInlineCodeTextComponent {
  @Input() public text = '';

  /**
   * Splits text into plain and inline-code segments.
   *
   * @returns Text segments for safe template rendering.
   */
  public segments(): readonly InlineCodeSegment[] {
    const parts = this.text.split('`');

    return parts
      .map((part: string, index: number): InlineCodeSegment => ({
        code: index % 2 === 1,
        text: part,
      }))
      .filter((segment: InlineCodeSegment): boolean => segment.text.length > 0);
  }
}
