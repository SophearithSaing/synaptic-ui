import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SynNavItem } from '../models/nav-item.model';

@Component({
  selector: 'syn-nav-items',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-items.component.html',
  styleUrl: './nav-items.component.scss',
})
export class SynNavItemsComponent {
  @Input() public ariaLabel = 'Primary navigation';

  @Input() public items: readonly SynNavItem[] = [];
}
