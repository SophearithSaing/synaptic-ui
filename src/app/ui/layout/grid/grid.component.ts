import { Component, Input } from '@angular/core';

export type SynGridColumns = 1 | 2 | 3 | 4 | 'workspace';

@Component({
  selector: 'syn-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class SynGridComponent {
  @Input() public columns: SynGridColumns = 1;

  /**
   * Returns whether the grid should use the requested column layout.
   *
   * @param columns Column layout to compare.
   * @returns True when the requested columns match the active grid layout.
   */
  public hasColumns(columns: SynGridColumns): boolean {
    return this.columns === columns;
  }
}
