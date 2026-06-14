import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'syn-container',
  standalone: true,
  imports: [NgClass],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
})
export class SynContainerComponent implements OnChanges {
  @Input({ transform: booleanAttribute }) public narrow = false;

  public containerClasses: Record<string, boolean> =
    this.createContainerClasses();

  /**
   * Updates container classes when inputs change.
   */
  public ngOnChanges(): void {
    this.containerClasses = this.createContainerClasses();
  }

  /**
   * Builds state classes for the rendered container.
   *
   * @returns Container class map keyed by CSS class name.
   */
  private createContainerClasses(): Record<string, boolean> {
    return {
      'container--narrow': this.narrow,
    };
  }
}
