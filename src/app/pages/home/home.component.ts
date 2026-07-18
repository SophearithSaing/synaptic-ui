import {
  Component,
  DestroyRef,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import {
  SynBrandComponent,
  SynButtonComponent,
  SynCardComponent,
  SynContainerComponent,
  SynEmptyStateComponent,
  SynGridComponent,
  SynNavBarComponent,
  SynNavItem,
  SynNavItemsComponent,
  SynPageShellComponent,
  SynProgressCardComponent,
  SynSectionHeaderComponent,
  SynStackComponent,
} from '../../ui';

import { AuthApiService } from '../../auth-api.service';
import { AuthSessionService } from '../../auth-session.service';
import { InProgressSession } from '../../models/session.models';
import { Topic, TopicCategoryGroup } from '../../models/topic.models';
import { SessionService } from '../../session.service';
import { TopicCatalogService } from '../../topic-catalog.service';

interface HomeProgressTopic {
  readonly session: InProgressSession;
  readonly topic: Topic;
}

@Component({
  selector: 'app-home',
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynCardComponent,
    SynContainerComponent,
    SynEmptyStateComponent,
    SynGridComponent,
    SynNavBarComponent,
    SynNavItemsComponent,
    SynPageShellComponent,
    SynProgressCardComponent,
    SynSectionHeaderComponent,
    SynStackComponent,
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public readonly catalogError = signal<string | null>(null);
  public readonly categoryGroups = signal<readonly TopicCategoryGroup[]>([]);
  public readonly loading = signal(true);
  public readonly inProgressSessions = signal<readonly InProgressSession[]>([]);
  public readonly sessionsError = signal<string | null>(null);

  public readonly navItems: readonly SynNavItem[] = [
    {
      active: true,
      label: 'Home',
      routerLink: '/home',
    },
    {
      label: 'Design',
      routerLink: '/design-system',
    },
  ];

  public constructor(
    private readonly authApi: AuthApiService,
    private readonly authSession: AuthSessionService,
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly topicCatalog: TopicCatalogService,
    private readonly destroyRef: DestroyRef,
  ) {}

  /**
   * Loads the topic catalog when the authenticated workspace opens.
   */
  public ngOnInit(): void {
    this.topicCatalog
      .loadCatalog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (groups: readonly TopicCategoryGroup[]): void => {
          this.catalogError.set(null);
          this.categoryGroups.set(groups);
          this.loading.set(false);
        },
        error: (): void => {
          this.catalogError.set(
            'Unable to load the topic catalog from the API.',
          );
          this.categoryGroups.set([]);
          this.loading.set(false);
        },
      });

    this.sessionService
      .loadInProgressSessions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (sessions: readonly InProgressSession[]): void => {
          this.sessionsError.set(null);
          this.inProgressSessions.set(sessions);
        },
        error: (): void => {
          this.sessionsError.set(
            'Unable to load your in-progress sessions from the API.',
          );
          this.inProgressSessions.set([]);
        },
      });
  }

  /**
   * Revokes the API session and returns to the landing page.
   */
  public logOut(): void {
    this.authApi
      .logout()
      .pipe(
        finalize((): void => {
          this.authSession.signOut();
          void this.router.navigate(['/']);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  /**
   * Returns progress cards with their matching topic metadata.
   *
   * @returns Topic progress summaries enriched with topic details.
   */
  public inProgressTopics(): readonly HomeProgressTopic[] {
    return this.inProgressSessions().map(
      (session: InProgressSession): HomeProgressTopic => ({
        session,
        topic: this.findTopic(session.topic.id) ?? session.topic,
      }),
    );
  }

  /**
   * Returns a stable category id for template tracking.
   *
   * @param group Category group rendered by the template.
   * @returns Stable category id.
   */
  public categoryTrackBy(group: TopicCategoryGroup): string {
    return group.category.id;
  }

  /**
   * Returns a stable topic id for template tracking.
   *
   * @param topic Topic rendered by the template.
   * @returns Stable topic id.
   */
  public topicTrackBy(topic: Topic): string {
    return topic.id;
  }

  /**
   * Returns a stable in-progress session id for template tracking.
   *
   * @param summary In-progress summary rendered by the template.
   * @returns Stable session id.
   */
  public sessionTrackBy(summary: HomeProgressTopic): string {
    return summary.session.id;
  }

  /**
   * Returns a bounded progress percentage for a session level.
   *
   * @param session In-progress session to inspect.
   * @returns Progress percentage for display.
   */
  public sessionProgress(session: InProgressSession): number {
    return Math.max(0, Math.min(100, session.currentLevel));
  }

  /**
   * Finds a topic across all loaded categories.
   *
   * @param topicId Topic id to find.
   * @returns Matching topic, or null when no topic exists.
   */
  private findTopic(topicId: string): Topic | null {
    for (const group of this.categoryGroups()) {
      const topic = group.topics.find(
        (candidate: Topic): boolean => candidate.id === topicId,
      );

      if (topic !== undefined) {
        return topic;
      }
    }

    return null;
  }
}
