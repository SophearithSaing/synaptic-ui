import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  Component,
  Input,
  OnChanges,
} from '@angular/core';

import {
  SynStackDirection,
  SynStackSize,
} from '../models/stack.model';

@Component({
  selector: 'syn-stack',
  standalone: true,
  imports: [NgClass],
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.scss',
})
export class SynStackComponent implements OnChanges {
  @Input() public direction: SynStackDirection = 'vertical';

  @Input({ transform: booleanAttribute }) public page = false;

  @Input() public size: SynStackSize = 'md';

  public stackClasses: Record<string, boolean> = this.createStackClasses();

  /**
   * Updates stack classes when inputs change.
   */
  public ngOnChanges(): void {
    this.stackClasses = this.createStackClasses();
  }

  /**
   * Builds layout classes for the rendered stack.
   *
   * @returns Stack class map keyed by CSS class name.
   */
  private createStackClasses(): Record<string, boolean> {
    return {
      'stack--inline': this.direction === 'inline',
      'stack--split': this.direction === 'split',
      'stack--lg': this.size === 'lg',
      'stack--page': this.page,
    };
  }
}
