import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'syn-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class SynCardComponent implements OnChanges {
  @Input({ transform: booleanAttribute }) public flush = false;

  @Input({ transform: booleanAttribute }) public interactive = false;

  @Input({ transform: booleanAttribute }) public ledger = false;

  @Input() public description: string | null = null;

  @Input() public label: string | null = null;

  @Input() public tags: readonly string[] = [];

  @Input() public title: string | null = null;

  public cardClasses: Record<string, boolean> = this.createCardClasses();

  /**
   * Updates card classes when inputs change.
   */
  public ngOnChanges(): void {
    this.cardClasses = this.createCardClasses();
  }

  /**
   * Builds state classes for the rendered card.
   *
   * @returns Card class map keyed by CSS class name.
   */
  private createCardClasses(): Record<string, boolean> {
    return {
      'card--flush': this.flush,
      'card--interactive': this.interactive,
      'card--ledger': this.ledger,
    };
  }
}
