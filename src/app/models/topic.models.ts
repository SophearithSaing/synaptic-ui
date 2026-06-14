export interface TopicCategory {
  readonly _id: string;
  readonly title: string;
  readonly slug: string;
  readonly description: string;
  readonly icon: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface Topic {
  readonly _id: string;
  readonly title: string;
  readonly slug: string;
  readonly description: string;
  readonly icon: string;
  readonly tags: readonly string[];
  readonly category: string | TopicCategory;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface TopicCategoryGroup {
  readonly category: TopicCategory;
  readonly topics: readonly Topic[];
}

export interface TopicProgressSummary {
  readonly topicId: string;
  readonly level: number;
  readonly progress: number;
}
