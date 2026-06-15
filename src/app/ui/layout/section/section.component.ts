import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'syn-section',
  standalone: true,
  imports: [NgClass],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
})
export class SynSectionComponent implements OnChanges {
  @Input({ transform: booleanAttribute }) public raised = false;

  @Input() public sectionId: string | null = null;

  public sectionClasses: Record<string, boolean> = this.createSectionClasses();

  /**
   * Updates section classes when inputs change.
   */
  public ngOnChanges(): void {
    this.sectionClasses = this.createSectionClasses();
  }

  /**
   * Builds state classes for the rendered section.
   *
   * @returns Section class map keyed by CSS class name.
   */
  private createSectionClasses(): Record<string, boolean> {
    return {
      'section--raised': this.raised,
    };
  }
}
