import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SynNavItem } from '../models/nav-item.model';

@Component({
  selector: 'syn-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class SynFooterComponent {
  @Input() public ariaLabel = 'Footer navigation';

  @Input() public brand: string | null = 'Synaptic';

  @Input() public copy: string | null = null;

  @Input() public links: readonly SynNavItem[] = [];
}
