import { Component, signal } from '@angular/core';

import { SynButtonComponent } from '../../ui/actions/button/button.component';
import { SynTextLinkComponent } from '../../ui/actions/text-link/text-link.component';
import { SynCardComponent } from '../../ui/content/card/card.component';
import { SynCatalogCardComponent } from '../../ui/content/catalog-card/catalog-card.component';
import { SynChipComponent } from '../../ui/content/chip/chip.component';
import { SynEmptyStateComponent } from '../../ui/content/empty-state/empty-state.component';
import { SynInfoCardComponent } from '../../ui/content/info-card/info-card.component';
import { SynLedgerListComponent } from '../../ui/content/ledger-list/ledger-list.component';
import { SynLedgerItem } from '../../ui/content/models/ledger-item.model';
import { SynTokenTone } from '../../ui/content/models/token.model';
import { SynProgressCardComponent } from '../../ui/content/progress-card/progress-card.component';
import { SynTokenComponent } from '../../ui/content/token/token.component';
import { SynOptionComponent } from '../../ui/feedback/option/option.component';
import { SynProgressBarComponent } from '../../ui/feedback/progress-bar/progress-bar.component';
import { SynFormFieldComponent } from '../../ui/forms/form-field/form-field.component';
import { SynFormPanelComponent } from '../../ui/forms/form-panel/form-panel.component';
import { SynInputComponent } from '../../ui/forms/input/input.component';
import { SynContainerComponent } from '../../ui/layout/container/container.component';
import { SynGridComponent } from '../../ui/layout/grid/grid.component';
import { SynPageShellComponent } from '../../ui/layout/page-shell/page-shell.component';
import { SynSectionComponent } from '../../ui/layout/section/section.component';
import { SynSectionHeaderComponent } from '../../ui/layout/section-header/section-header.component';
import { SynStackComponent } from '../../ui/layout/stack/stack.component';
import { SynBrandComponent } from '../../ui/navigation/brand/brand.component';
import { SynFooterComponent } from '../../ui/navigation/footer/footer.component';
import { SynMobileNavComponent } from '../../ui/navigation/mobile-nav/mobile-nav.component';
import { SynNavItem } from '../../ui/navigation/models/nav-item.model';
import { SynNavBarComponent } from '../../ui/navigation/nav-bar/nav-bar.component';
import { SynNavItemsComponent } from '../../ui/navigation/nav-items/nav-items.component';

interface Principle {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

interface ColorToken {
  readonly name: string;
  readonly label: string;
  readonly value: string;
  readonly className: string;
}

interface FunctionalToken {
  readonly name: string;
  readonly tone: SynTokenTone;
}

interface TypeSpecimen {
  readonly name: string;
  readonly className: string;
  readonly sample: string;
}

interface SpacingToken {
  readonly name: string;
  readonly value: string;
}

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynCardComponent,
    SynCatalogCardComponent,
    SynChipComponent,
    SynContainerComponent,
    SynEmptyStateComponent,
    SynFooterComponent,
    SynFormFieldComponent,
    SynFormPanelComponent,
    SynGridComponent,
    SynInfoCardComponent,
    SynInputComponent,
    SynLedgerListComponent,
    SynMobileNavComponent,
    SynNavBarComponent,
    SynNavItemsComponent,
    SynOptionComponent,
    SynPageShellComponent,
    SynProgressBarComponent,
    SynProgressCardComponent,
    SynSectionComponent,
    SynSectionHeaderComponent,
    SynStackComponent,
    SynTextLinkComponent,
    SynTokenComponent,
  ],
  templateUrl: './design-system.component.html',
  styleUrl: './design-system.component.scss',
})
export class DesignSystemComponent {
  public readonly mobileNavOpen = signal(false);

  public readonly navItems: readonly SynNavItem[] = [
    {
      label: 'Home',
      routerLink: '/',
    },
    {
      active: true,
      label: 'Design',
      routerLink: '/design-system',
    },
  ];

  public readonly footerLinks: readonly SynNavItem[] = [
    {
      label: 'Home',
      routerLink: '/',
    },
    {
      label: 'Design System',
      routerLink: '/design-system',
    },
  ];

  public readonly ledgerItems: readonly SynLedgerItem[] = [
    {
      icon: 'close',
      title: 'Not a quick-answer tool',
      description: 'Synaptic keeps friction in the learning loop.',
      tone: 'danger',
    },
    {
      icon: 'check_circle',
      title: 'Reusable ledger row',
      description: 'Ledger lists support neutral and semantic icon tones.',
    },
  ];

  public readonly iconSamples: readonly string[] = [
    'auto_stories',
    'architecture',
    'subject',
    'check_circle',
    'error',
  ];

  public readonly principles: readonly Principle[] = [
    {
      icon: 'auto_stories',
      title: 'Quiet & Focused',
      description:
        'Use neutral surfaces, hard dividers, and restrained interactions.',
    },
    {
      icon: 'subject',
      title: 'Text-First',
      description: 'Let hierarchy come from type, rhythm, and reading order.',
    },
    {
      icon: 'architecture',
      title: 'Neutral Hierarchy',
      description:
        'Prefer grids, ledgers, and explicit boundaries over decoration.',
    },
  ];

  public readonly colors: readonly ColorToken[] = [
    {
      name: 'primary',
      label: 'Deep Slate',
      value: '#00091b',
      className: 'design-swatch--primary',
    },
    {
      name: 'secondary',
      label: 'Muted Slate',
      value: '#545f72',
      className: 'design-swatch--secondary',
    },
    {
      name: 'surface',
      label: 'Base Surface',
      value: '#f7fafc',
      className: 'design-swatch--surface',
    },
    {
      name: 'surface-container-lowest',
      label: 'Card Surface',
      value: '#ffffff',
      className: 'design-swatch--card',
    },
  ];

  public readonly functionalTokens: readonly FunctionalToken[] = [
    {
      name: 'primary-fixed',
      tone: 'primary',
    },
    {
      name: 'secondary-container',
      tone: 'secondary',
    },
    {
      name: 'outline',
      tone: 'outline',
    },
    {
      name: 'error',
      tone: 'error',
    },
  ];

  public readonly typeSpecimens: readonly TypeSpecimen[] = [
    {
      name: 'Display',
      className: 'syn-display',
      sample: 'Source Serif 4',
    },
    {
      name: 'Headline Large',
      className: 'syn-heading-lg',
      sample: 'Source Serif 4',
    },
    {
      name: 'Headline Medium',
      className: 'syn-heading-md',
      sample: 'Source Serif 4',
    },
    {
      name: 'Body Large',
      className: 'syn-body-lg',
      sample: 'Inter',
    },
    {
      name: 'Body Medium',
      className: 'syn-body-md',
      sample: 'Inter - The quick brown fox jumps over the lazy dog.',
    },
    {
      name: 'Label Small',
      className: 'syn-kicker',
      sample: 'JETBRAINS MONO - SYSTEM MESSAGE',
    },
  ];

  public readonly spacingTokens: readonly SpacingToken[] = [
    {
      name: 'space-sm',
      value: '12px',
    },
    {
      name: 'space-md',
      value: '24px',
    },
    {
      name: 'space-lg',
      value: '48px',
    },
  ];

  /**
   * Toggles the mobile navigation menu visibility.
   */
  public toggleMobileNav(): void {
    this.mobileNavOpen.update((isOpen: boolean): boolean => !isOpen);
  }

  /**
   * Closes the mobile navigation menu after navigation.
   */
  public closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }
}
