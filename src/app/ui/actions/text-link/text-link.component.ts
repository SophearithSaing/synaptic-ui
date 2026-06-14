import { NgClass, NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, Input, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'syn-text-link',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, RouterLink],
  templateUrl: './text-link.component.html',
  styleUrl: './text-link.component.scss',
})
export class SynTextLinkComponent implements OnChanges {
  @Input() public href: string | null = null;

  @Input() public label = '';

  @Input() public routerLink: string | null = null;

  @Input({ transform: booleanAttribute }) public subtle = false;

  public linkClasses: Record<string, boolean> = this.createLinkClasses();

  /**
   * Updates link classes when inputs change.
   */
  public ngOnChanges(): void {
    this.linkClasses = this.createLinkClasses();
  }

  /**
   * Builds state classes for the rendered text link.
   *
   * @returns Text link class map keyed by CSS class name.
   */
  private createLinkClasses(): Record<string, boolean> {
    return {
      'text-link--subtle': this.subtle,
    };
  }
}
