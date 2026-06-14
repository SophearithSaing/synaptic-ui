import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SynNavAction, SynNavItem } from '../models/nav-item.model';

@Component({
  selector: 'syn-mobile-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mobile-nav.component.html',
  styleUrl: './mobile-nav.component.scss',
})
export class SynMobileNavComponent {
  @Input() public actions: readonly SynNavAction[] = [];

  @Input() public ariaLabel = 'Mobile navigation';

  @Input() public items: readonly SynNavItem[] = [];

  @Output() public readonly navigate = new EventEmitter<void>();

  /**
   * Emits when a mobile navigation item is activated.
   */
  public onNavigate(): void {
    this.navigate.emit();
  }
}
