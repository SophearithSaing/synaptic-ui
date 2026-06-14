import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

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

interface BoundaryItem {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  public readonly mobileNavOpen = signal(false);

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

  public readonly boundaries: readonly BoundaryItem[] = [
    {
      title: 'Not a quick-answer tool',
      description:
        'Synaptic does not provide copy-paste solutions. The friction is the ' +
        'learning mechanism.',
    },
    {
      title: 'Not a coding bootcamp',
      description:
        'The platform assumes prior programming knowledge and focuses on ' +
        'architecture, theory, and reasoning.',
    },
    {
      title: 'Not a casual distraction',
      description:
        'The experience is designed for focused study sessions, not bright ' +
        'gamification or social engagement loops.',
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
