import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { AiLogsService } from '../../ai-logs.service';
import {
  AiLog,
  AiLogPage,
  AiLogQuestionStatus,
} from '../../models/ai-log.models';
import {
  SynButtonComponent,
  SynCardComponent,
  SynContainerComponent,
  SynEmptyStateComponent,
  SynJsonViewerDialogComponent,
  SynPageShellComponent,
  SynSectionHeaderComponent,
  SynStackComponent,
} from '../../ui';

type AiLogStatusFilter =
  'all' | 'pending' | 'rejected' | 'accepted' | 'unlinked';

interface AiLogStatusFilterOption {
  readonly id: AiLogStatusFilter;
  readonly label: string;
}

interface AiLogViewer {
  readonly content: string;
  readonly title: string;
}

const LOG_PAGE_LIMIT = 20;

const OPERATION_LABELS: Record<string, string> = {
  'question-generation': 'Question Generation',
};

@Component({
  selector: 'app-ai-logs',
  imports: [
    DatePipe,
    SynButtonComponent,
    SynCardComponent,
    SynContainerComponent,
    SynEmptyStateComponent,
    SynJsonViewerDialogComponent,
    SynPageShellComponent,
    SynSectionHeaderComponent,
    SynStackComponent,
  ],
  templateUrl: './ai-logs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ai-logs.component.scss',
})
export class AiLogsComponent implements OnInit {
  public readonly error = signal<string | null>(null);

  public readonly loading = signal(true);

  public readonly logPage = signal<AiLogPage | null>(null);

  public readonly statusFilter = signal<AiLogStatusFilter>('all');

  public readonly viewer = signal<AiLogViewer | null>(null);

  public readonly statusFilters: readonly AiLogStatusFilterOption[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'unlinked', label: 'Unlinked' },
  ];

  public readonly filteredLogs = computed((): readonly AiLog[] => {
    const page = this.logPage();

    if (page === null) {
      return [];
    }

    return page.items.filter((log: AiLog): boolean =>
      this.matchesStatusFilter(log),
    );
  });

  public constructor(
    private readonly aiLogs: AiLogsService,
    private readonly destroyRef: DestroyRef,
  ) {}

  /**
   * Loads the first page of AI logs when the page opens.
   */
  public ngOnInit(): void {
    this.loadLogs(1);
  }

  /**
   * Sets the visible linked-question status filter.
   *
   * @param filter Status category to show for the current API page.
   */
  public setStatusFilter(filter: AiLogStatusFilter): void {
    this.statusFilter.set(filter);
  }

  /**
   * Loads an available server page of AI logs.
   *
   * @param page One-based page number to load.
   */
  public goToPage(page: number): void {
    const currentPage = this.logPage();

    if (
      currentPage === null ||
      page < 1 ||
      page > this.pageCount(currentPage) ||
      this.loading()
    ) {
      return;
    }

    this.loadLogs(page);
  }

  /**
   * Reports whether a previous server page is available.
   *
   * @returns True when the previous page can be loaded.
   */
  public hasPreviousPage(): boolean {
    return this.logPage()?.page !== undefined && this.logPage()!.page > 1;
  }

  /**
   * Reports whether a following server page is available.
   *
   * @returns True when the next page can be loaded.
   */
  public hasNextPage(): boolean {
    const page = this.logPage();

    return page !== null && page.page < this.pageCount(page);
  }

  /**
   * Returns a stable log id for template tracking.
   *
   * @param log AI log rendered by the template.
   * @returns Stable AI log id.
   */
  public logTrackBy(log: AiLog): string {
    return log.id;
  }

  /**
   * Formats an API operation identifier for display.
   *
   * @param operation API operation identifier.
   * @returns Human-readable operation label.
   */
  public operationLabel(operation: string): string {
    return OPERATION_LABELS[operation] ?? operation.replaceAll('-', ' ');
  }

  /**
   * Returns a short prompt excerpt suitable for a summary card.
   *
   * @param value Full API prompt or question value.
   * @param limit Maximum excerpt length.
   * @returns Collapsed and bounded text excerpt.
   */
  public truncate(value: string, limit = 180): string {
    const collapsed = value.replaceAll(/\s+/g, ' ').trim();

    return collapsed.length > limit
      ? `${collapsed.slice(0, limit).trimEnd()}...`
      : collapsed;
  }

  /**
   * Returns the linked question prompt for a log entry.
   *
   * @param log AI log to inspect.
   * @returns Linked question prompt or an unlinked placeholder.
   */
  public questionPrompt(log: AiLog): string {
    return log.liveQuestion?.question.prompt ?? 'No linked live question.';
  }

  /**
   * Returns the specific linked-question status for a card.
   *
   * @param log AI log to inspect.
   * @returns Persisted question status or unlinked when none exists.
   */
  public questionStatus(log: AiLog): AiLogQuestionStatus | 'unlinked' {
    return log.liveQuestion?.status ?? 'unlinked';
  }

  /**
   * Formats a linked-question status for display.
   *
   * @param log AI log to inspect.
   * @returns Human-readable status label.
   */
  public questionStatusLabel(log: AiLog): string {
    const status = this.questionStatus(log);

    return status === 'unlinked'
      ? 'Unlinked'
      : status.charAt(0).toUpperCase() + status.slice(1);
  }

  /**
   * Opens the full AI instruction prompt for a log entry.
   *
   * @param log AI log to inspect.
   */
  public openPrompt(log: AiLog): void {
    this.openViewer('AI Prompt', this.formatJson(log.prompt));
  }

  /**
   * Opens the persisted question as formatted JSON when one exists.
   *
   * @param log AI log to inspect.
   */
  public openQuestionJson(log: AiLog): void {
    if (log.liveQuestion === null) {
      return;
    }

    this.openViewer(
      'Question JSON',
      JSON.stringify(log.liveQuestion.question, null, 2),
    );
  }

  /**
   * Opens the full AI completion output for a log entry.
   *
   * @param log AI log to inspect.
   */
  public openOutput(log: AiLog): void {
    this.openViewer('AI Output', this.formatJson(log.output));
  }

  /**
   * Closes the active JSON or text viewer.
   */
  public closeViewer(): void {
    this.viewer.set(null);
  }

  /**
   * Returns the total count of server pages for a response.
   *
   * @param page Paginated API response.
   * @returns Number of available pages, including an empty first page.
   */
  public pageCount(page: AiLogPage): number {
    return Math.max(1, Math.ceil(page.total / page.limit));
  }

  /**
   * Loads a paginated API response into the page state.
   *
   * @param page One-based API page to request.
   */
  private loadLogs(page: number): void {
    this.error.set(null);
    this.loading.set(true);
    this.aiLogs
      .loadLogs(page, LOG_PAGE_LIMIT)
      .pipe(
        finalize((): void => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response: AiLogPage): void => {
          this.logPage.set(response);
        },
        error: (): void => {
          this.error.set('Unable to load AI completion logs from the API.');
          this.logPage.set(null);
        },
      });
  }

  /**
   * Opens the shared read-only viewer with a title and content payload.
   *
   * @param title Viewer heading.
   * @param content Complete content to render.
   */
  private openViewer(title: string, content: string): void {
    this.viewer.set({ content, title });
  }

  /**
   * Pretty-prints JSON content and preserves non-JSON content verbatim.
   *
   * @param content Raw content that may contain JSON.
   * @returns Formatted JSON or the original content string.
   */
  private formatJson(content: string): string {
    try {
      return JSON.stringify(JSON.parse(content), null, 2);
    } catch {
      return content;
    }
  }

  /**
   * Reports whether a log belongs to the selected status category.
   *
   * @param log AI log to inspect.
   * @returns True when the log should remain visible.
   */
  private matchesStatusFilter(log: AiLog): boolean {
    const filter = this.statusFilter();
    const status = this.questionStatus(log);

    if (filter === 'all') {
      return true;
    }

    if (filter === 'accepted') {
      return status === 'passed' || status === 'failed';
    }

    return status === filter;
  }
}
