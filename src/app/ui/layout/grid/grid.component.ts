import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';

import { SynGridColumns } from '../models/grid.model';

@Component({
  selector: 'syn-grid',
  imports: [NgClass],
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './grid.component.scss',
})
export class SynGridComponent implements OnChanges {
  @Input() public columns: SynGridColumns = 1;

  public gridClasses: Record<string, boolean> = this.createGridClasses();

  /**
   * Updates grid classes when inputs change.
   */
  public ngOnChanges(): void {
    this.gridClasses = this.createGridClasses();
  }

  /**
   * Builds layout classes for the rendered grid.
   *
   * @returns Grid class map keyed by CSS class name.
   */
  private createGridClasses(): Record<string, boolean> {
    return {
      'grid--2': this.columns === 2,
      'grid--3': this.columns === 3,
      'grid--4': this.columns === 4,
      'grid--workspace': this.columns === 'workspace',
    };
  }
}
