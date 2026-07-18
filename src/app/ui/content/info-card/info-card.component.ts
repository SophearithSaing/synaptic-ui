import { NgClass } from '@angular/common';
import { booleanAttribute, Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'syn-info-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.scss',
})
export class SynInfoCardComponent implements OnChanges {
  @Input() public description = '';

  @Input() public icon: string | null = null;

  @Input({ transform: booleanAttribute }) public interactive = false;

  @Input({ required: true }) public title = '';

  public cardClasses: Record<string, boolean> = this.createCardClasses();

  /**
   * Updates info card classes when inputs change.
   */
  public ngOnChanges(): void {
    this.cardClasses = this.createCardClasses();
  }

  /**
   * Builds state classes for the rendered info card.
   *
   * @returns Info card class map keyed by CSS class name.
   */
  private createCardClasses(): Record<string, boolean> {
    return {
      'info-card--interactive': this.interactive,
    };
  }
}
