import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { SynNavAction, SynNavItem } from '../models/nav-item.model';

interface SynMobileNavActionItem {
  readonly action: SynNavAction;
  readonly classes: Record<string, boolean>;
}

@Component({
  selector: 'syn-mobile-nav',
  imports: [NgClass, RouterLink],
  templateUrl: './mobile-nav.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './mobile-nav.component.scss',
})
export class SynMobileNavComponent implements OnChanges {
  @Input() public actions: readonly SynNavAction[] = [];

  @Input() public ariaLabel = 'Mobile navigation';

  @Input() public items: readonly SynNavItem[] = [];

  @Output() public readonly navigate = new EventEmitter<void>();

  @Output() public readonly action = new EventEmitter<string>();

  public actionItems: readonly SynMobileNavActionItem[] =
    this.createActionItems();

  /**
   * Updates action item view models when inputs change.
   */
  public ngOnChanges(): void {
    this.actionItems = this.createActionItems();
  }

  /**
   * Emits when a mobile navigation item is activated.
   */
  public onNavigate(): void {
    this.navigate.emit();
  }

  /**
   * Emits when a mobile navigation action is activated.
   *
   * @param navAction Mobile navigation action that was activated.
   */
  public onAction(navAction: SynNavAction): void {
    if (navAction.actionId) {
      this.action.emit(navAction.actionId);
    }

    this.onNavigate();
  }

  /**
   * Builds mobile action view models with variant classes.
   *
   * @returns Mobile navigation action view models.
   */
  private createActionItems(): readonly SynMobileNavActionItem[] {
    return this.actions.map((action: SynNavAction): SynMobileNavActionItem => ({
      action,
      classes: {
        'mobile-nav__action--primary': action.variant === 'primary',
        'mobile-nav__action--secondary': action.variant === 'secondary',
      },
    }));
  }
}
