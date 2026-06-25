import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { Topic, TopicCategory, TopicCategoryGroup } from './models/topic.models';
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

@Injectable({
  providedIn: 'root',
})
export class TopicCatalogService {
  public constructor(private readonly http: HttpClient) {}

  /**
   * Loads topic categories and topics from the API.
   *
   * @returns Observable of topic category groups.
   */
  public loadCatalog(): Observable<readonly TopicCategoryGroup[]> {
    return forkJoin({
      categories: this.http.get<readonly TopicCategory[]>(
        `${API_BASE_URL}/categories/categories`,
      ),
      topics: this.http.get<readonly Topic[]>(`${API_BASE_URL}/topics`),
    }).pipe(
      map(
        (response: {
          readonly categories: readonly TopicCategory[];
          readonly topics: readonly Topic[];
        }): readonly TopicCategoryGroup[] =>
          this.groupTopics(
            this.resolveCategoryIcons(response.categories),
            this.resolveTopicIcons(response.topics),
          ),
      ),
    );
  }

  /**
   * Returns a stable topic id from API topic records.
   *
   * @param topic Topic returned by the API.
   * @returns Topic id value.
   */
  public topicId(topic: Topic): string {
    return topic.id;
  }

  /**
   * Resolves topic icon names for existing UI usage.
   *
   * @param topic Topic returned by the API.
   * @returns Topic with a supported Material Symbol icon.
   */
  public resolveTopicIcon(topic: Topic): Topic {
    return {
      ...topic,
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
              icon: this.resolveIcon(
                topic.category.icon,
                topic.category.slug,
                CATEGORY_ICON_MAP,
                'schema',
              ),
            },
    };
  }

  /**
   * Resolves category icon names for existing UI usage.
   *
   * @param categories Topic categories returned by the API.
   * @returns Categories with supported Material Symbol icons.
   */
  private resolveCategoryIcons(
    categories: readonly TopicCategory[],
  ): readonly TopicCategory[] {
    return categories.map(
      (category: TopicCategory): TopicCategory => ({
        ...category,
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
   * Resolves topic icon names for existing UI usage.
   *
   * @param topics Topics returned by the API.
   * @returns Topics with supported Material Symbol icons.
   */
  private resolveTopicIcons(topics: readonly Topic[]): readonly Topic[] {
    return topics.map(
      (topic: Topic): Topic => this.resolveTopicIcon(topic),
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
          (topic: Topic): boolean =>
            this.categoryId(topic) === this.categoryIdValue(category),
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
   * @param fallback Fallback icon for unknown values.
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

    return this.categoryIdValue(topic.category);
  }

  /**
   * Returns a stable category id from API category records.
   *
   * @param category Category returned by the API.
   * @returns Category id value.
   */
  private categoryIdValue(category: TopicCategory): string {
    return category.id;
  }
}
