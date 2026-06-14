import { booleanAttribute, Component, Input } from '@angular/core';

import {
  SynStackDirection,
  SynStackSize,
} from '../models/stack.model';

@Component({
  selector: 'syn-stack',
  standalone: true,
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.scss',
})
export class SynStackComponent {
  @Input() public direction: SynStackDirection = 'vertical';

  @Input({ transform: booleanAttribute }) public page = false;

  @Input() public size: SynStackSize = 'md';

  /**
   * Returns whether the stack uses the requested direction.
   *
   * @param direction Direction to compare.
   * @returns True when the requested direction matches the stack direction.
   */
  public hasDirection(direction: SynStackDirection): boolean {
    return this.direction === direction;
  }

  /**
   * Returns whether the stack uses the requested spacing size.
   *
   * @param size Spacing size to compare.
   * @returns True when the requested size matches the stack size.
   */
  public hasSize(size: SynStackSize): boolean {
    return this.size === size;
  }
}
