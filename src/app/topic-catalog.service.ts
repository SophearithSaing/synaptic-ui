import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

import { AuthSessionService } from './auth-session.service';
import {
  Topic,
  TopicCategory,
  TopicCategoryGroup,
  TopicProgressSummary,
} from './models/topic.models';
import { environment } from '../environments/environment';

const API_BASE_URL = environment.API_BASE_URL;

const CATEGORY_ICON_MAP: Record<string, string> = {
  code: 'code',
  'computer-science-concepts': 'schema',
  'cs-concepts': 'schema',
  deployed_code: 'deployed_code',
  'languages-tech-stacks': 'code',
  'operations-infrastructure': 'deployed_code',
  'ops-infra': 'deployed_code',
  schema: 'schema',
  'tech-stacks': 'code',
};

const TOPIC_ICON_MAP: Record<string, string> = {
  automation: 'automation',
  'backend-engineering': 'dns',
  concurrency: 'sync',
  conversion_path: 'conversion_path',
  data_object: 'data_object',
  database: 'database',
  databases: 'database',
  'distributed-systems': 'hub',
  dns: 'dns',
  hub: 'hub',
  kubernetes: 'conversion_path',
  lan: 'lan',
  memory: 'memory',
  'memory-management': 'memory',
  networking: 'lan',
  node: 'terminal',
  'node-js': 'terminal',
  rust: 'data_object',
  'rust-fundamentals': 'data_object',
  sync: 'sync',
  terminal: 'terminal',
  'ci-cd-pipelines': 'automation',
};

const FALLBACK_CATEGORIES: readonly TopicCategory[] = [
  {
    _id: 'cs-concepts',
    title: 'Computer Science Concepts',
    slug: 'cs-concepts',
    description: 'Core theories and fundamental CS principles.',
    icon: 'schema',
  },
  {
    _id: 'tech-stacks',
    title: 'Languages & Tech Stacks',
    slug: 'tech-stacks',
    description: 'Programming languages, runtimes, and backend foundations.',
    icon: 'code',
  },
  {
    _id: 'ops-infra',
    title: 'Operations & Infrastructure',
    slug: 'ops-infra',
    description: 'Delivery, containers, orchestration, and platform practice.',
    icon: 'deployed_code',
  },
];

const FALLBACK_TOPICS: readonly Topic[] = [
  {
    _id: 'memory-management',
    title: 'Memory Management',
    slug: 'memory-management',
    description: 'Understanding stack, heap, and garbage collection.',
    icon: 'memory',
    tags: ['systems', 'runtime'],
    category: FALLBACK_CATEGORIES[0],
  },
  {
    _id: 'concurrency',
    title: 'Concurrency',
    slug: 'concurrency',
    description: 'Reason about scheduling, synchronization, and parallelism.',
    icon: 'sync',
    tags: ['systems', 'parallelism'],
    category: FALLBACK_CATEGORIES[0],
  },
  {
    _id: 'distributed-systems',
    title: 'Distributed Systems',
    slug: 'distributed-systems',
    description: 'Explore replication, consensus, and failure models.',
    icon: 'hub',
    tags: ['distributed', 'networking'],
    category: FALLBACK_CATEGORIES[0],
  },
  {
    _id: 'node-js',
    title: 'Node.js',
    slug: 'node-js',
    description: 'Backend runtime behavior, event loops, and async patterns.',
    icon: 'terminal',
    tags: ['backend', 'runtime'],
    category: FALLBACK_CATEGORIES[1],
  },
  {
    _id: 'rust-fundamentals',
    title: 'Rust Fundamentals',
    slug: 'rust-fundamentals',
    description: 'Ownership, borrowing, lifetimes, and memory safety.',
    icon: 'data_object',
    tags: ['systems', 'memory-safety'],
    category: FALLBACK_CATEGORIES[1],
  },
  {
    _id: 'kubernetes',
    title: 'Kubernetes',
    slug: 'kubernetes',
    description: 'Cluster orchestration, workload scheduling, and services.',
    icon: 'conversion_path',
    tags: ['orchestration', 'containers'],
    category: FALLBACK_CATEGORIES[2],
  },
  {
    _id: 'ci-cd-pipelines',
    title: 'CI/CD Pipelines',
    slug: 'ci-cd-pipelines',
    description: 'Automation patterns for repeatable delivery workflows.',
    icon: 'automation',
    tags: ['automation', 'devops'],
    category: FALLBACK_CATEGORIES[2],
  },
];

const FALLBACK_PROGRESS: readonly TopicProgressSummary[] = [
  // TODO: Remove prototype progress once session progress is API-backed.
  {
    topicId: 'distributed-systems',
    level: 42,
    progress: 42,
  },
  {
    topicId: 'memory-management',
    level: 12,
    progress: 12,
  },
];

@Injectable({
  providedIn: 'root',
})
export class TopicCatalogService {
  public constructor(
    private readonly http: HttpClient,
    private readonly authSession: AuthSessionService,
  ) {}

  /**
   * Loads topic categories and topics from the API when possible.
   *
   * @returns Observable of topic category groups.
   */
  public loadCatalog(): Observable<readonly TopicCategoryGroup[]> {
    const headers = this.authHeaders();

    if (headers === null) {
      return of(this.groupTopics(FALLBACK_CATEGORIES, FALLBACK_TOPICS));
    }

    return forkJoin({
      categories: this.http.get<readonly TopicCategory[]>(
        `${API_BASE_URL}/categories/categories`,
        { headers },
      ),
      topics: this.http.get<readonly Topic[]>(`${API_BASE_URL}/topics`, {
        headers,
      }),
    }).pipe(
      map(
        (response: {
          readonly categories: readonly TopicCategory[];
          readonly topics: readonly Topic[];
        }): readonly TopicCategoryGroup[] =>
          this.groupTopics(
            this.normalizeCategories(response.categories),
            this.normalizeTopics(response.topics),
          ),
      ),
      catchError(
        (): Observable<readonly TopicCategoryGroup[]> =>
          of(this.groupTopics(FALLBACK_CATEGORIES, FALLBACK_TOPICS)),
      ),
    );
  }

  /**
   * Returns temporary progress summaries for the current prototype home.
   *
   * @returns Temporary topic progress summaries.
   */
  public loadProgress(): readonly TopicProgressSummary[] {
    return FALLBACK_PROGRESS;
  }

  /**
   * Normalizes API category id fields for existing UI usage.
   *
   * @param categories Topic categories returned by the API.
   * @returns Categories with `_id` populated.
   */
  private normalizeCategories(
    categories: readonly TopicCategory[],
  ): readonly TopicCategory[] {
    return categories.map(
      (category: TopicCategory): TopicCategory => ({
        ...category,
        _id: category._id ?? category.id ?? category.slug,
        icon: this.resolveIcon(
          category.icon,
          category.slug,
          CATEGORY_ICON_MAP,
          'schema',
        ),
      }),
    );
  }

  /**
   * Normalizes API topic id fields for existing UI usage.
   *
   * @param topics Topics returned by the API.
   * @returns Topics with `_id` populated.
   */
  private normalizeTopics(topics: readonly Topic[]): readonly Topic[] {
    return topics.map(
      (topic: Topic): Topic => ({
        ...topic,
        _id: topic._id ?? topic.id ?? topic.slug,
        icon: this.resolveIcon(
          topic.icon,
          topic.slug,
          TOPIC_ICON_MAP,
          'school',
        ),
        category:
          typeof topic.category === 'string'
            ? topic.category
            : {
                ...topic.category,
                _id:
                  topic.category._id ??
                  topic.category.id ??
                  topic.category.slug,
                icon: this.resolveIcon(
                  topic.category.icon,
                  topic.category.slug,
                  CATEGORY_ICON_MAP,
                  'schema',
                ),
              },
      }),
    );
  }

  /**
   * Groups topics under their API category records.
   *
   * @param categories Topic categories returned by the API.
   * @param topics Topics returned by the API.
   * @returns Topics grouped by category.
   */
  private groupTopics(
    categories: readonly TopicCategory[],
    topics: readonly Topic[],
  ): readonly TopicCategoryGroup[] {
    return categories.map(
      (category: TopicCategory): TopicCategoryGroup => ({
        category,
        topics: topics.filter(
          (topic: Topic): boolean => this.categoryId(topic) === category._id,
        ),
      }),
    );
  }

  /**
   * Resolves a supported Material Symbol icon name.
   *
   * @param icon API icon value.
   * @param slug API slug value.
   * @param iconMap Known API values mapped to Material Symbols.
   * @param fallback Fallback Material Symbol icon.
   * @returns Material Symbol icon name.
   */
  private resolveIcon(
    icon: string,
    slug: string,
    iconMap: Record<string, string>,
    fallback: string,
  ): string {
    return iconMap[icon] ?? iconMap[slug] ?? fallback;
  }

  /**
   * Resolves the category id from a populated or unpopulated topic category.
   *
   * @param topic Topic with a category reference.
   * @returns Category id for the topic.
   */
  private categoryId(topic: Topic): string {
    if (typeof topic.category === 'string') {
      return topic.category;
    }

    return topic.category._id;
  }

  /**
   * Builds authenticated API headers when a bearer token exists.
   *
   * @returns HTTP headers with bearer auth, or null when no token exists.
   */
  private authHeaders(): HttpHeaders | null {
    const token = this.authSession.accessToken();

    if (token === null) {
      return null;
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
