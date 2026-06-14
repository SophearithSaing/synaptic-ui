import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  readonly className: string;
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
  imports: [RouterLink],
  templateUrl: './design-system.component.html',
  styleUrl: './design-system.component.scss',
})
export class DesignSystemComponent {
  public readonly mobileNavOpen = signal(false);

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
      className: 'syn-token--primary',
    },
    {
      name: 'secondary-container',
      className: 'syn-token--secondary',
    },
    {
      name: 'outline',
      className: 'syn-token--outline',
    },
    {
      name: 'error',
      className: 'syn-token--error',
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
