import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import {
  SynBrandComponent,
  SynButtonComponent,
  SynContainerComponent,
  SynEmptyStateComponent,
  SynFooterComponent,
  SynInlineCodeTextComponent,
  SynNavBarComponent,
  SynPageShellComponent,
} from '../../ui';
import {
  EvaluatedAnswer,
  QuestionSet,
  SessionAnswerSubmission,
  SessionQuestion,
  SessionQuestionOption,
  SessionSubmitResponse,
} from '../../models/session.models';
import { Topic, TopicCategoryGroup } from '../../models/topic.models';
import { SessionService } from '../../session.service';
import { TopicCatalogService } from '../../topic-catalog.service';

@Component({
  selector: 'app-session-page',
  standalone: true,
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynContainerComponent,
    SynEmptyStateComponent,
    SynFooterComponent,
    SynInlineCodeTextComponent,
    SynNavBarComponent,
    SynPageShellComponent,
  ],
  templateUrl: './session-page.component.html',
  styleUrl: './session-page.component.scss',
})
export class SessionPageComponent implements OnInit {
  public readonly answers = signal<Record<string, string>>({});
  public readonly error = signal<string | null>(null);
  public readonly feedback = signal<SessionSubmitResponse | null>(null);
  public readonly loading = signal(true);
  public readonly questionSet = signal<QuestionSet | null>(null);
  public readonly submitting = signal(false);
  public readonly topic = signal<Topic | null>(null);

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly topicCatalog: TopicCatalogService,
    private readonly destroyRef: DestroyRef,
  ) {}

  /**
   * Loads topic metadata and starts the focused learning session.
   */
  public ngOnInit(): void {
    const topicId = this.route.snapshot.paramMap.get('topicId');

    if (topicId === null) {
      void this.router.navigate(['/home']);
      return;
    }

    this.topicCatalog
      .loadCatalog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((groups: readonly TopicCategoryGroup[]): void => {
        const topic = this.findTopic(groups, topicId);

        if (topic === null) {
          this.loading.set(false);
          return;
        }

        this.topic.set(topic);
        this.loadQuestionSet(topic);
      });
  }

  /**
   * Stores a selected multiple-choice answer.
   *
   * @param questionId Question id being answered.
   * @param optionId Selected option id.
   */
  public selectOption(questionId: string, optionId: string): void {
    this.answers.update(
      (answers: Record<string, string>): Record<string, string> => ({
        ...answers,
        [questionId]: optionId,
      }),
    );
  }

  /**
   * Stores a written answer.
   *
   * @param questionId Question id being answered.
   * @param event Textarea input event.
   */
  public writeAnswer(questionId: string, event: Event): void {
    const element = event.target as HTMLTextAreaElement;

    this.answers.update(
      (answers: Record<string, string>): Record<string, string> => ({
        ...answers,
        [questionId]: element.value,
      }),
    );
  }

  /**
   * Submits the current question set for feedback.
   */
  public submitSet(): void {
    const topic = this.topic();
    const questionSet = this.questionSet();

    if (topic === null || questionSet === null || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.sessionService
      .submitAnswers(topic, questionSet, this.submissions())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (feedback: SessionSubmitResponse): void => {
          this.feedback.set(feedback);
          this.error.set(null);
          this.submitting.set(false);
        },
        error: (error: Error): void => {
          this.error.set(error.message);
          this.submitting.set(false);
        },
      });
  }

  /**
   * Advances to the next available question set.
   */
  public nextQuestion(): void {
    const nextQuestionSet = this.feedback()?.nextQuestionSet ?? null;

    if (nextQuestionSet === null) {
      void this.router.navigate(['/home']);
      return;
    }

    this.questionSet.set(nextQuestionSet);
    this.feedback.set(null);
    this.answers.set({});
    window.setTimeout((): void => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  /**
   * Ends the focused session and returns home.
   */
  public endSession(): void {
    void this.router.navigate(['/home']);
  }

  /**
   * Reports whether the question has the provided selected option.
   *
   * @param questionId Question id to inspect.
   * @param optionId Option id to compare.
   * @returns True when the option is selected.
   */
  public optionSelected(questionId: string, optionId: string): boolean {
    return this.answers()[questionId] === optionId;
  }

  /**
   * Returns the current answer text for a question.
   *
   * @param questionId Question id to inspect.
   * @returns Current answer text.
   */
  public answerText(questionId: string): string {
    return this.answers()[questionId] ?? '';
  }

  /**
   * Reports whether every question has an answer.
   *
   * @returns True when all questions are answered.
   */
  public canSubmit(): boolean {
    const questionSet = this.questionSet();

    if (questionSet === null) {
      return false;
    }

    return questionSet.questions.every(
      (question: SessionQuestion): boolean =>
        (this.answers()[question.id] ?? '').trim().length > 0,
    );
  }

  /**
   * Returns the number of questions with submitted answers.
   *
   * @returns Answered question count.
   */
  public answeredCount(): number {
    return Object.values(this.answers()).filter(
      (answer: string): boolean => answer.trim().length > 0,
    ).length;
  }

  /**
   * Formats a one-based question number.
   *
   * @param index Zero-based question index.
   * @returns Padded question number.
   */
  public questionNumber(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  /**
   * Returns the feedback answer for a question id.
   *
   * @param questionId Question id to inspect.
   * @returns Evaluated answer, or null when missing.
   */
  public feedbackAnswer(questionId: string): EvaluatedAnswer | null {
    return (
      this.feedback()?.attempt.answers.find(
        (answer: EvaluatedAnswer): boolean => answer.questionId === questionId,
      ) ?? null
    );
  }

  /**
   * Returns readable submitted answer text for feedback.
   *
   * @param question Question associated with the feedback answer.
   * @returns Submitted answer text for display.
   */
  public submittedAnswerText(question: SessionQuestion): string {
    const answer = this.feedbackAnswer(question.id)?.answer ?? '';

    return this.optionText(question, answer) || 'No answer submitted';
  }

  /**
   * Returns readable correct answer text for feedback.
   *
   * @param question Question associated with the feedback answer.
   * @returns Correct answer text for display.
   */
  public correctAnswerText(question: SessionQuestion): string {
    const answer = this.feedbackAnswer(question.id)?.correctAnswer ?? '';

    return this.optionText(question, answer) || answer;
  }

  /**
   * Returns option text for MCQ answer ids.
   *
   * @param question Question associated with the answer.
   * @param answer Answer value returned by the API.
   * @returns Option text for MCQ ids, or the original answer.
   */
  public optionText(question: SessionQuestion, answer: string): string {
    if (question.type !== 'mcq') {
      return answer;
    }

    return (
      question.options.find(
        (option: SessionQuestionOption): boolean => option.id === answer,
      )?.text ?? answer
    );
  }

  /**
   * Returns the feedback score as a percentage.
   *
   * @returns Score percentage for display.
   */
  public scorePercent(): number {
    return Math.round((this.feedback()?.attempt.setScore ?? 0) * 100);
  }

  /**
   * Returns the number of correctly answered questions.
   *
   * @returns Count of correct answers.
   */
  public correctCount(): number {
    return (
      this.feedback()?.attempt.answers.filter(
        (answer: EvaluatedAnswer): boolean => answer.score >= 0.8,
      ).length ?? 0
    );
  }

  /**
   * Reports whether the submitted set has any incorrect answers.
   *
   * @returns True when at least one answer is below the correct threshold.
   */
  public hasWrongAnswer(): boolean {
    return (
      this.feedback()?.attempt.answers.some(
        (answer: EvaluatedAnswer): boolean => answer.score < 0.8,
      ) ?? false
    );
  }

  /**
   * Tracks questions by their stable id.
   *
   * @param question Question rendered by the template.
   * @returns Stable question id.
   */
  public questionTrackBy(question: SessionQuestion): string {
    return question.id;
  }

  /**
   * Tracks options by their stable id.
   *
   * @param option Option rendered by the template.
   * @returns Stable option id.
   */
  public optionTrackBy(option: SessionQuestionOption): string {
    return option.id;
  }

  /**
   * Loads the active question set for the selected topic.
   *
   * @param topic Topic selected by the student.
   */
  private loadQuestionSet(topic: Topic): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    const isContinue = this.router.url.includes('/continue');
    const source = isContinue
      ? this.sessionService.continueSession(topic, sessionId)
      : this.sessionService.startSession(topic);

    source.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (questionSet: QuestionSet): void => {
        this.questionSet.set(questionSet);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (error: Error): void => {
        this.error.set(error.message);
        this.loading.set(false);
      },
    });
  }

  /**
   * Finds a topic by id or slug across category groups.
   *
   * @param groups Topic category groups to search.
   * @param topicId Topic id or slug from the route.
   * @returns Matching topic, or null when missing.
   */
  private findTopic(
    groups: readonly TopicCategoryGroup[],
    topicId: string,
  ): Topic | null {
    for (const group of groups) {
      const topic = group.topics.find(
        (candidate: Topic): boolean =>
          candidate.id === topicId || candidate.slug === topicId,
      );

      if (topic !== undefined) {
        return topic;
      }
    }

    return null;
  }

  /**
   * Builds answer submissions from the current answer state.
   *
   * @returns Student answer submissions.
   */
  private submissions(): readonly SessionAnswerSubmission[] {
    return Object.entries(this.answers()).map(
      ([questionId, answer]: [string, string]): SessionAnswerSubmission => ({
        questionId,
        answer,
      }),
    );
  }
}
