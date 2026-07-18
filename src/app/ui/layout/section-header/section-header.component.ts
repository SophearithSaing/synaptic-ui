import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'syn-section-header',
  imports: [NgClass],
  templateUrl: './section-header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './section-header.component.scss',
})
export class SynSectionHeaderComponent implements OnChanges {
  @Input() public description: string | null = null;

  @Input() public headingId: string | null = null;

  @Input({ transform: booleanAttribute }) public inline = false;

  @Input({ required: true }) public title = '';

  public headerClasses: Record<string, boolean> = this.createHeaderClasses();

  /**
   * Updates section header classes when inputs change.
   */
  public ngOnChanges(): void {
    this.headerClasses = this.createHeaderClasses();
  }

  /**
   * Builds state classes for the rendered section header.
   *
   * @returns Section header class map keyed by CSS class name.
   */
  private createHeaderClasses(): Record<string, boolean> {
    return {
      'section-header--inline': this.inline,
    };
  }
}
