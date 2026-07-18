import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SynNavItem } from '../models/nav-item.model';

@Component({
  selector: 'syn-nav-items',
  imports: [RouterLink],
  templateUrl: './nav-items.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './nav-items.component.scss',
})
export class SynNavItemsComponent {
  @Input() public ariaLabel = 'Primary navigation';

  @Input() public items: readonly SynNavItem[] = [];
}
