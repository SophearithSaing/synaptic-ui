import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { AuthSessionService } from '../../auth-session.service';
import {
  Topic,
  TopicCategoryGroup,
  TopicProgressSummary,
} from '../../models/topic.models';
import { TopicCatalogService } from '../../topic-catalog.service';
import { SynButtonComponent } from '../../ui/actions/button/button.component';
import { SynCatalogCardComponent } from '../../ui/content/catalog-card/catalog-card.component';
import { SynEmptyStateComponent } from '../../ui/content/empty-state/empty-state.component';
import { SynProgressCardComponent } from '../../ui/content/progress-card/progress-card.component';
import { SynContainerComponent } from '../../ui/layout/container/container.component';
import { SynGridComponent } from '../../ui/layout/grid/grid.component';
import { SynPageShellComponent } from '../../ui/layout/page-shell/page-shell.component';
import { SynSectionHeaderComponent } from '../../ui/layout/section-header/section-header.component';
import { SynStackComponent } from '../../ui/layout/stack/stack.component';
import { SynBrandComponent } from '../../ui/navigation/brand/brand.component';
import { SynNavItem } from '../../ui/navigation/models/nav-item.model';
import { SynNavBarComponent } from '../../ui/navigation/nav-bar/nav-bar.component';
import { SynNavItemsComponent } from '../../ui/navigation/nav-items/nav-items.component';

interface HomeProgressTopic {
  readonly topic: Topic;
  readonly progress: TopicProgressSummary;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynCatalogCardComponent,
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
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  public readonly categoryGroups = signal<readonly TopicCategoryGroup[]>([]);
  public readonly loading = signal(true);
  public readonly progressSummaries = signal<readonly TopicProgressSummary[]>(
    [],
  );

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
    private readonly authSession: AuthSessionService,
    private readonly router: Router,
    private readonly topicCatalog: TopicCatalogService,
    private readonly destroyRef: DestroyRef,
  ) {}

  /**
   * Loads the topic catalog when the authenticated workspace opens.
   */
  public ngOnInit(): void {
    this.progressSummaries.set(this.topicCatalog.loadProgress());
    this.topicCatalog
      .loadCatalog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((groups: readonly TopicCategoryGroup[]): void => {
        this.categoryGroups.set(groups);
        this.loading.set(false);
      });
  }

  /**
   * Clears the temporary local session and returns to the landing page.
   */
  public logOut(): void {
    this.authSession.signOut();
    void this.router.navigate(['/']);
  }

  /**
   * Returns progress cards with their matching topic metadata.
   *
   * @returns Topic progress summaries enriched with topic details.
   */
  public inProgressTopics(): readonly HomeProgressTopic[] {
    return this.progressSummaries()
      .map((progress: TopicProgressSummary): HomeProgressTopic | null => {
        const topic = this.findTopic(progress.topicId);

        if (topic === null) {
          return null;
        }

        return {
          topic,
          progress,
        };
      })
      .filter(
        (summary: HomeProgressTopic | null): summary is HomeProgressTopic =>
          summary !== null,
      );
  }

  /**
   * Returns a stable category id for template tracking.
   *
   * @param group Category group rendered by the template.
   * @returns Stable category id.
   */
  public categoryTrackBy(group: TopicCategoryGroup): string {
    return group.category._id;
  }

  /**
   * Returns a stable topic id for template tracking.
   *
   * @param topic Topic rendered by the template.
   * @returns Stable topic id.
   */
  public topicTrackBy(topic: Topic): string {
    return topic._id;
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
        (candidate: Topic): boolean => candidate._id === topicId,
      );

      if (topic !== undefined) {
        return topic;
      }
    }

    return null;
  }
}
