import {
  Component,
  DestroyRef,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import {
  SynBrandComponent,
  SynButtonComponent,
  SynCardComponent,
  SynConfirmationDialogComponent,
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
  readonly mode: HomeSessionMode;
  readonly session: InProgressSession;
  readonly topic: Topic;
}

interface HomeProgressSession {
  readonly mode: HomeSessionMode;
  readonly session: InProgressSession;
}

type HomeSessionMode = 'standard' | 'live';

@Component({
  selector: 'app-home',
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynCardComponent,
    SynConfirmationDialogComponent,
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
  public readonly inProgressSessions = signal<readonly HomeProgressSession[]>(
    [],
  );
  public readonly sessionsError = signal<string | null>(null);
  public readonly stopSessionError = signal<string | null>(null);
  public readonly stopSessionLoading = signal(false);
  public readonly stopSessionRequest = signal<HomeProgressTopic | null>(null);

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

    forkJoin({
      live: this.sessionService.loadLiveInProgressSessions(),
      standard: this.sessionService.loadInProgressSessions(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (sessions: {
          readonly live: readonly InProgressSession[];
          readonly standard: readonly InProgressSession[];
        }): void => {
          this.sessionsError.set(null);
          this.inProgressSessions.set(
            this.combineSessions(sessions.standard, sessions.live),
          );
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
      (summary: HomeProgressSession): HomeProgressTopic => ({
        mode: summary.mode,
        session: summary.session,
        topic: this.findTopic(summary.session.topic.id) ?? summary.session.topic,
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
    return `${summary.mode}:${summary.session.id}`;
  }

  /**
   * Returns the session mode label for display.
   *
   * @param summary In-progress summary rendered by the template.
   * @returns Human-readable session mode label.
   */
  public sessionModeLabel(summary: HomeProgressTopic): string {
    return summary.mode === 'standard' ? 'Standard' : 'Live';
  }

  /**
   * Returns the route for continuing an in-progress session.
   *
   * @param summary In-progress summary rendered by the template.
   * @returns Continue route for the session mode.
   */
  public sessionRouterLink(summary: HomeProgressTopic): string {
    const topicId = summary.topic.id;
    const sessionId = summary.session.id;

    if (summary.mode === 'live') {
      return `/session/${topicId}/live/continue/${sessionId}`;
    }

    return `/session/${topicId}/continue/${sessionId}`;
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
   * Returns the confirmation dialog copy for a session stop request.
   *
   * @param summary In-progress summary selected for stopping.
   * @returns Confirmation dialog body copy.
   */
  public stopSessionDescription(summary: HomeProgressTopic): string {
    return `${summary.topic.title} will be removed from your in-progress topics.`;
  }

  /**
   * Opens the stop confirmation dialog for an in-progress session.
   *
   * @param summary In-progress summary selected for stopping.
   */
  public requestStopSession(summary: HomeProgressTopic): void {
    if (summary.mode !== 'standard') {
      return;
    }

    this.stopSessionError.set(null);
    this.stopSessionRequest.set(summary);
  }

  /**
   * Closes the stop confirmation dialog without changing progress.
   */
  public cancelStopSession(): void {
    if (this.stopSessionLoading()) {
      return;
    }

    this.stopSessionError.set(null);
    this.stopSessionRequest.set(null);
  }

  /**
   * Deletes the selected in-progress session from the API and local UI state.
   */
  public confirmStopSession(): void {
    const request = this.stopSessionRequest();

    if (request === null || this.stopSessionLoading()) {
      return;
    }

    this.stopSessionError.set(null);
    this.stopSessionLoading.set(true);
    this.sessionService
      .deleteSession(request.session.id)
      .pipe(
        finalize((): void => {
          this.stopSessionLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (): void => {
          this.inProgressSessions.update(
            (
              sessions: readonly HomeProgressSession[],
            ): readonly HomeProgressSession[] =>
              sessions.filter(
                (summary: HomeProgressSession): boolean =>
                  summary.mode !== request.mode ||
                  summary.session.id !== request.session.id,
              ),
          );
          this.stopSessionRequest.set(null);
        },
        error: (): void => {
          this.stopSessionError.set(
            'Unable to stop this session. Please try again.',
          );
        },
      });
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

  /**
   * Combines standard and live sessions into one sorted progress list.
   *
   * @param standardSessions Standard in-progress sessions.
   * @param liveSessions Live in-progress sessions.
   * @returns Combined in-progress session summaries.
   */
  private combineSessions(
    standardSessions: readonly InProgressSession[],
    liveSessions: readonly InProgressSession[],
  ): readonly HomeProgressSession[] {
    return [
      ...standardSessions.map(
        (session: InProgressSession): HomeProgressSession => ({
          mode: 'standard',
          session,
        }),
      ),
      ...liveSessions.map(
        (session: InProgressSession): HomeProgressSession => ({
          mode: 'live',
          session,
        }),
      ),
    ].sort(
      (left: HomeProgressSession, right: HomeProgressSession): number =>
        Date.parse(right.session.updatedAt) - Date.parse(left.session.updatedAt),
    );
  }
}
