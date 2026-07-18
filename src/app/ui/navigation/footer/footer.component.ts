import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SynNavItem } from '../models/nav-item.model';

@Component({
  selector: 'syn-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.scss',
})
export class SynFooterComponent {
  @Input() public ariaLabel = 'Footer navigation';

  @Input() public copy: string | null = '© 2026 Synaptic. Not a real company.';

  @Input() public links: readonly SynNavItem[] = [];
}
