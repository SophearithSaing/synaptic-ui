import { Component, signal } from '@angular/core';

import { SynButtonComponent } from '../../ui/actions/button/button.component';
import { SynTextLinkComponent } from '../../ui/actions/text-link/text-link.component';
import { SynCatalogCardComponent } from '../../ui/content/catalog-card/catalog-card.component';
import { SynEmptyStateComponent } from '../../ui/content/empty-state/empty-state.component';
import { SynInfoCardComponent } from '../../ui/content/info-card/info-card.component';
import { SynLedgerListComponent } from '../../ui/content/ledger-list/ledger-list.component';
import { SynLedgerItem } from '../../ui/content/models/ledger-item.model';
import { SynContainerComponent } from '../../ui/layout/container/container.component';
import { SynGridComponent } from '../../ui/layout/grid/grid.component';
import { SynPageShellComponent } from '../../ui/layout/page-shell/page-shell.component';
import { SynSectionComponent } from '../../ui/layout/section/section.component';
import { SynSectionHeaderComponent } from '../../ui/layout/section-header/section-header.component';
import { SynBrandComponent } from '../../ui/navigation/brand/brand.component';
import { SynFooterComponent } from '../../ui/navigation/footer/footer.component';
import {
  SynNavAction,
  SynNavItem,
} from '../../ui/navigation/models/nav-item.model';
import { SynMobileNavComponent } from '../../ui/navigation/mobile-nav/mobile-nav.component';
import { SynNavBarComponent } from '../../ui/navigation/nav-bar/nav-bar.component';
import { SynNavItemsComponent } from '../../ui/navigation/nav-items/nav-items.component';

interface FeatureCard {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

interface CurriculumTrack {
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynCatalogCardComponent,
    SynContainerComponent,
    SynEmptyStateComponent,
    SynFooterComponent,
    SynGridComponent,
    SynInfoCardComponent,
    SynLedgerListComponent,
    SynMobileNavComponent,
    SynNavBarComponent,
    SynNavItemsComponent,
    SynPageShellComponent,
    SynSectionComponent,
    SynSectionHeaderComponent,
    SynTextLinkComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  public readonly mobileNavOpen = signal(false);

  public readonly navItems: readonly SynNavItem[] = [
    {
      active: true,
      href: '#home',
      label: 'Home',
    },
    {
      href: '#philosophy',
      label: 'Philosophy',
    },
    {
      href: '#curriculum',
      label: 'Curriculum',
    },
    {
      label: 'Design',
      routerLink: '/design-system',
    },
  ];

  public readonly navActions: readonly SynNavAction[] = [
    {
      label: 'Log In',
      routerLink: '/login',
      variant: 'secondary',
    },
    {
      label: 'Sign Up',
      routerLink: '/register',
      variant: 'primary',
    },
  ];

  public readonly footerLinks: readonly SynNavItem[] = [
    {
      href: '#curriculum',
      label: 'Documentation',
    },
    {
      href: '#home',
      label: 'Privacy Policy',
    },
    {
      href: '#home',
      label: 'Terms of Service',
    },
  ];

  public readonly philosophyCards: readonly FeatureCard[] = [
    {
      icon: 'repeat',
      title: 'Structured Repetition',
      description:
        'Core concepts are revisited through focused sessions until they ' +
        'become reliable mental models.',
    },
    {
      icon: 'edit_document',
      title: 'Written Explanation',
      description:
        'Students move beyond recognition by explaining technical ideas in ' +
        'clear, rigorous prose.',
    },
    {
      icon: 'troubleshoot',
      title: 'Focused Feedback',
      description:
        'Feedback is direct, precise, and aimed at correcting gaps in logic ' +
        'or system understanding.',
    },
  ];

  public readonly curriculumTracks: readonly CurriculumTrack[] = [
    {
      label: 'Track 01',
      title: 'Theoretical Computing',
      description:
        'Automata theory, computability, complexity classes, and formal ' +
        'languages for understanding algorithmic limits.',
      tags: ['Turing Machines', 'P vs NP'],
    },
    {
      label: 'Track 02',
      title: 'Distributed Systems',
      description:
        'Consensus protocols, replication strategies, logical clocks, and ' +
        'failure models across unreliable networks.',
      tags: ['Raft / Paxos', 'CAP Theorem'],
    },
    {
      label: 'Track 03',
      title: 'Advanced Data Structures',
      description:
        'B-Trees, Bloom Filters, LSM Trees, and probabilistic structures ' +
        'behind databases and search systems.',
      tags: ['Storage Engines', 'Amortized Analysis'],
    },
  ];

  public readonly boundaries: readonly SynLedgerItem[] = [
    {
      icon: 'close',
      title: 'Not a quick-answer tool',
      description:
        'Synaptic does not provide copy-paste solutions. The friction is the ' +
        'learning mechanism.',
      tone: 'danger',
    },
    {
      icon: 'close',
      title: 'Not a coding bootcamp',
      description:
        'The platform assumes prior programming knowledge and focuses on ' +
        'architecture, theory, and reasoning.',
      tone: 'danger',
    },
    {
      icon: 'close',
      title: 'Not a casual distraction',
      description:
        'The experience is designed for focused study sessions, not bright ' +
        'gamification or social engagement loops.',
      tone: 'danger',
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
