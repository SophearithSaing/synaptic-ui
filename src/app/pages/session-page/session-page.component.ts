import {
  Component,
  DestroyRef,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import {
  SynBrandComponent,
  SynButtonComponent,
  SynConfirmationDialogComponent,
  SynContainerComponent,
  SynEmptyStateComponent,
  SynFooterComponent,
  SynInlineCodeTextComponent,
  SynNavBarComponent,
  SynPageShellComponent,
} from '../../ui';
import {
  EvaluatedAnswer,
  LiveQuestionResponse,
  LiveSessionSubmitResponse,
  QuestionSet,
  SessionAnswerSubmission,
  SessionQuestion,
  SessionQuestionOption,
  SessionSubmitResponse,
  StartSessionResponse,
} from '../../models/session.models';
import { Topic, TopicCategoryGroup } from '../../models/topic.models';
import { SessionService } from '../../session.service';
import { TopicCatalogService } from '../../topic-catalog.service';

interface SessionFeedbackView {
  readonly answers: readonly EvaluatedAnswer[];
  readonly nextQuestionSet: QuestionSet | null;
  readonly score: number;
}

type SessionMode = 'standard' | 'live';

@Component({
  selector: 'app-session-page',
  imports: [
    SynBrandComponent,
    SynButtonComponent,
    SynConfirmationDialogComponent,
    SynContainerComponent,
    SynEmptyStateComponent,
    SynFooterComponent,
    SynInlineCodeTextComponent,
    SynNavBarComponent,
    SynPageShellComponent,
  ],
  templateUrl: './session-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './session-page.component.scss',
})
export class SessionPageComponent implements OnInit {
  private readonly correctAnswerThreshold = 0.5;
  private readonly liveQuestionTotal = 3;
  private readonly liveQuestionId = signal<string | null>(null);
  private readonly liveQuestions = signal<readonly SessionQuestion[]>([]);

  public readonly answers = signal<Record<string, string>>({});
  public readonly error = signal<string | null>(null);
  public readonly feedback = signal<SessionFeedbackView | null>(null);
  public readonly loading = signal(true);
  public readonly activeSessionId = signal<string | null>(null);
  public readonly questionSet = signal<QuestionSet | null>(null);
  public readonly rejectQuestionDialogOpen = signal(false);
  public readonly rejectQuestionError = signal<string | null>(null);
  public readonly rejectQuestionLoading = signal(false);
  public readonly rejectQuestionReason = signal('');
  public readonly sessionMode = signal<SessionMode>('standard');
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

    this.sessionMode.set(this.router.url.includes('/live') ? 'live' : 'standard');

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
    const questionSet = this.questionSet();
    const sessionId = this.activeSessionId();

    if (sessionId === null || questionSet === null || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    if (this.sessionMode() === 'live') {
      this.submitLiveSet(sessionId, questionSet);
      return;
    }

    this.sessionService
      .submitAnswers(sessionId, questionSet, this.submissions())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (feedback: SessionSubmitResponse): void => {
          this.feedback.set(this.toStandardFeedback(feedback));
          this.error.set(null);
          this.submitting.set(false);
          this.scrollToPageTop();
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

    if (this.sessionMode() === 'live') {
      this.liveQuestionId.set(nextQuestionSet.id);
    }

    this.questionSet.set(nextQuestionSet);
    this.feedback.set(null);
    this.answers.set({});
    this.scrollToPageTop();
  }

  /**
   * Ends the focused session and returns home.
   */
  public endSession(): void {
    void this.router.navigate(['/home']);
  }

  /**
   * Reports whether the current live question can be rejected.
   *
   * @returns True when a pending live question can be rejected.
   */
  public canRejectQuestion(): boolean {
    return (
      this.sessionMode() === 'live' &&
      this.feedback() === null &&
      this.questionSet() !== null &&
      this.liveQuestionId() !== null &&
      !this.submitting() &&
      !this.rejectQuestionLoading()
    );
  }

  /**
   * Opens the live question rejection dialog.
   */
  public openRejectQuestionDialog(): void {
    if (!this.canRejectQuestion()) {
      return;
    }

    this.rejectQuestionError.set(null);
    this.rejectQuestionReason.set('');
    this.rejectQuestionDialogOpen.set(true);
  }

  /**
   * Closes the live question rejection dialog.
   */
  public cancelRejectQuestion(): void {
    if (this.rejectQuestionLoading()) {
      return;
    }

    this.rejectQuestionDialogOpen.set(false);
    this.rejectQuestionError.set(null);
    this.rejectQuestionReason.set('');
  }

  /**
   * Stores the live question rejection reason.
   *
   * @param event Textarea input event.
   */
  public writeRejectQuestionReason(event: Event): void {
    const element = event.target as HTMLTextAreaElement;

    this.rejectQuestionReason.set(element.value);
  }

  /**
   * Rejects the current live question and loads its replacement.
   */
  public confirmRejectQuestion(): void {
    const sessionId = this.activeSessionId();
    const questionId = this.liveQuestionId();
    const topic = this.topic();
    const reason = this.rejectQuestionReason().trim();

    if (sessionId === null || questionId === null || topic === null) {
      this.rejectQuestionError.set('A live question is required to reject.');
      return;
    }

    if (!reason.length) {
      this.rejectQuestionError.set('Add a reason before rejecting.');
      return;
    }

    this.rejectQuestionError.set(null);
    this.rejectQuestionLoading.set(true);
    this.sessionService
      .rejectLiveQuestion(sessionId, questionId, reason)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: LiveQuestionResponse): void => {
          this.applyLiveQuestion(response, topic);
          this.answers.set({});
          this.feedback.set(null);
          this.rejectQuestionDialogOpen.set(false);
          this.rejectQuestionReason.set('');
          this.rejectQuestionLoading.set(false);
          this.scrollToPageTop();
        },
        error: (error: Error): void => {
          this.rejectQuestionError.set(error.message);
          this.rejectQuestionLoading.set(false);
        },
      });
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
   * Formats a one-based question number for the current session mode.
   *
   * @param question Question rendered by the template.
   * @param index Zero-based question index.
   * @returns Padded question number.
   */
  public questionNumber(question: SessionQuestion, index: number): string {
    if (this.sessionMode() === 'live') {
      return String(this.liveQuestionNumber(question)).padStart(2, '0');
    }

    return String(index + 1).padStart(2, '0');
  }

  /**
   * Returns the progress count for the active question set.
   *
   * @returns Answered progress count for display.
   */
  public progressAnsweredCount(): number {
    const questionSet = this.questionSet();

    if (questionSet === null || this.sessionMode() === 'standard') {
      return this.answeredCount();
    }

    const question = questionSet.questions[0] ?? null;

    if (question === null) {
      return 0;
    }

    const currentQuestionNumber = this.liveQuestionNumber(question);
    const currentAnswered = (this.answers()[question.id] ?? '').trim().length
      ? 1
      : 0;

    return Math.max(
      0,
      Math.min(
        this.liveQuestionTotal,
        currentQuestionNumber - 1 + currentAnswered,
      ),
    );
  }

  /**
   * Returns the progress total for the active question set.
   *
   * @returns Progress denominator for display.
   */
  public progressQuestionTotal(): number {
    if (this.sessionMode() === 'live') {
      return this.liveQuestionTotal;
    }

    return this.questionSet()?.questions.length ?? 0;
  }

  /**
   * Returns the current progress percentage.
   *
   * @returns Progress width percentage.
   */
  public progressPercent(): number {
    const total = this.progressQuestionTotal();

    if (!total) {
      return 0;
    }

    return (100 / total) * this.progressAnsweredCount();
  }

  /**
   * Returns the active session mode label for display.
   *
   * @returns Human-readable session mode label.
   */
  public sessionModeLabel(): string {
    return this.sessionMode() === 'standard' ? 'Standard' : 'Live';
  }

  /**
   * Returns questions that should be shown in the feedback ledger.
   *
   * @returns Feedback questions for the current mode.
   */
  public feedbackQuestions(): readonly SessionQuestion[] {
    const feedback = this.feedback();
    const questionSet = this.questionSet();

    if (feedback === null || questionSet === null) {
      return [];
    }

    if (this.sessionMode() === 'standard') {
      return questionSet.questions;
    }

    return feedback.answers.map(
      (answer: EvaluatedAnswer): SessionQuestion =>
        this.liveQuestion(answer.questionId) ??
        this.feedbackQuestionFromAnswer(answer),
    );
  }

  /**
   * Creates a display fallback for feedback without loaded question metadata.
   *
   * @param answer Evaluated answer returned by the API.
   * @returns Minimal question display model for the feedback ledger.
   */
  public feedbackQuestionFromAnswer(answer: EvaluatedAnswer): SessionQuestion {
    return {
      id: answer.questionId,
      type: answer.questionType,
      prompt: answer.questionPrompt,
      options: [],
      correctOptionId:
        answer.questionType === 'mcq' ? answer.correctAnswer : undefined,
      targetConcepts: answer.targetConcepts,
      feedback: {
        correct: answer.feedback,
        incorrect: answer.feedback,
      },
      rubrics: {
        keyPoints: answer.strengths,
        misconceptions: answer.weaknesses,
      },
    };
  }

  /**
   * Returns readable feedback question prompt text.
   *
   * @param question Question rendered by the feedback ledger.
   * @returns Question prompt text for display.
   */
  public feedbackQuestionPrompt(question: SessionQuestion): string {
    return question.prompt;
  }

  /**
   * Returns the total number of evaluated feedback answers.
   *
   * @returns Feedback answer count for summary display.
   */
  public feedbackQuestionTotal(): number {
    return Math.max(
      this.feedbackQuestions().length,
      this.feedback()?.answers.length ?? 0,
    );
  }

  /**
   * Returns the feedback answer for a question id.
   *
   * @param questionId Question id to inspect.
   * @returns Evaluated answer, or null when missing.
   */
  public feedbackAnswer(questionId: string): EvaluatedAnswer | null {
    return (
      this.feedback()?.answers.find(
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
    return Math.round((this.feedback()?.score ?? 0) * 100);
  }

  /**
   * Reports whether a question's feedback meets the correct threshold.
   *
   * @param questionId Question id to inspect.
   * @returns True when the evaluated score is correct.
   */
  public answerIsCorrect(questionId: string): boolean {
    return this.isCorrectAnswer(this.feedbackAnswer(questionId));
  }

  /**
   * Returns the number of correctly answered questions.
   *
   * @returns Count of correct answers.
   */
  public correctCount(): number {
    return (
      this.feedback()?.answers.filter(
        (answer: EvaluatedAnswer): boolean => this.isCorrectAnswer(answer),
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
      this.feedback()?.answers.some(
        (answer: EvaluatedAnswer): boolean => !this.isCorrectAnswer(answer),
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
   * Reports whether an evaluated answer meets the correct threshold.
   *
   * @param answer Evaluated answer to inspect.
   * @returns True when the answer score is at least the correct threshold.
   */
  private isCorrectAnswer(answer: EvaluatedAnswer | null): boolean {
    return (answer?.score ?? 0) >= this.correctAnswerThreshold;
  }

  /**
   * Scrolls the page back to the top after a view state transition.
   */
  private scrollToPageTop(): void {
    window.setTimeout((): void => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  /**
   * Loads the active question set for the selected topic.
   *
   * @param topic Topic selected by the student.
   */
  private loadQuestionSet(topic: Topic): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    const isContinue = this.router.url.includes('/continue');

    if (this.sessionMode() === 'live') {
      this.loadLiveQuestionSet(topic, isContinue ? sessionId : null);
      return;
    }

    if (isContinue) {
      this.loadContinuedQuestionSet(sessionId);
      return;
    }

    this.sessionService
      .startSession(topic)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: StartSessionResponse): void => {
          this.activeSessionId.set(response.sessionId);
          this.questionSet.set(response.questionSet);
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
   * Loads a question set for an existing session.
   *
   * @param sessionId Session id from the route.
   */
  private loadContinuedQuestionSet(sessionId: string | null): void {
    if (sessionId === null) {
      this.error.set('A session id is required to continue this session.');
      this.loading.set(false);
      return;
    }

    this.activeSessionId.set(sessionId);
    this.sessionService
      .continueSession(sessionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
   * Loads the active live question for a new or existing live session.
   *
   * @param topic Topic selected by the student.
   * @param sessionId Existing live session id, or null to start fresh.
   */
  private loadLiveQuestionSet(topic: Topic, sessionId: string | null): void {
    const request =
      sessionId === null
        ? this.sessionService.startLiveSession(topic)
        : this.sessionService.continueLiveSession(sessionId);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response: LiveQuestionResponse): void => {
        this.applyLiveQuestion(response, topic);
      },
      error: (error: Error): void => {
        this.error.set(error.message);
        this.loading.set(false);
      },
    });
  }

  /**
   * Stores a live API response in the shared session page state.
   *
   * @param response Live question response returned by the API.
   * @param topic Topic selected by the student.
   */
  private applyLiveQuestion(response: LiveQuestionResponse, topic: Topic): void {
    this.activeSessionId.set(response.sessionId);
    this.liveQuestionId.set(response.questionId);
    this.rememberLiveQuestion(response.question);
    this.questionSet.set(this.toLiveQuestionSet(response, topic));
    this.error.set(null);
    this.loading.set(false);
  }

  /**
   * Submits a single live answer for the current pending live question.
   *
   * @param sessionId Active live session id.
   * @param questionSet Synthetic live question set being answered.
   */
  private submitLiveSet(sessionId: string, questionSet: QuestionSet): void {
    const topic = this.topic();
    const question = questionSet.questions[0] ?? null;
    const questionId = this.liveQuestionId();

    if (topic === null || question === null || questionId === null) {
      this.error.set('A live question is required before submitting.');
      this.submitting.set(false);
      return;
    }

    const answer = (this.answers()[question.id] ?? '').trim();

    if (!answer.length) {
      this.error.set('An answer is required before submitting.');
      this.submitting.set(false);
      return;
    }

    this.sessionService
      .submitLiveAnswer(sessionId, questionId, answer)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (feedback: LiveSessionSubmitResponse): void => {
          this.feedback.set(this.toLiveFeedback(feedback, topic));
          this.error.set(null);
          this.submitting.set(false);
          this.scrollToPageTop();
        },
        error: (error: Error): void => {
          this.error.set(error.message);
          this.submitting.set(false);
        },
      });
  }

  /**
   * Converts standard submit feedback into a shared feedback view model.
   *
   * @param response Standard session submit response.
   * @returns Shared feedback view model.
   */
  private toStandardFeedback(
    response: SessionSubmitResponse,
  ): SessionFeedbackView {
    return {
      answers: response.attempt.answers,
      nextQuestionSet: response.nextQuestionSet,
      score: response.attempt.setScore,
    };
  }

  /**
   * Converts live submit feedback into a shared feedback view model.
   *
   * @param response Live session submit response.
   * @param topic Topic selected by the student.
   * @returns Shared feedback view model.
   */
  private toLiveFeedback(
    response: LiveSessionSubmitResponse,
    topic: Topic,
  ): SessionFeedbackView {
    const nextQuestionSet =
      response.nextQuestion === null
        ? null
        : this.toLiveQuestionSet(response.nextQuestion, topic);

    if (response.nextQuestion !== null) {
      this.rememberLiveQuestion(response.nextQuestion.question);
    }

    return {
      answers: response.answers,
      nextQuestionSet,
      score: this.averageScore(response.answers),
    };
  }

  /**
   * Converts a live question response into the regular page question-set shape.
   *
   * @param response Live question response returned by the API.
   * @param topic Topic selected by the student.
   * @returns Synthetic question set containing the pending live question.
   */
  private toLiveQuestionSet(
    response: LiveQuestionResponse,
    topic: Topic,
  ): QuestionSet {
    const now = new Date().toISOString();

    return {
      id: response.questionId,
      topic: topic.id,
      setType: 'live',
      level: this.liveLevel(response.question),
      questions: [response.question],
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Stores live questions seen by this page instance for feedback lookups.
   *
   * @param question Live question returned by the API.
   */
  private rememberLiveQuestion(question: SessionQuestion): void {
    this.liveQuestions.update(
      (questions: readonly SessionQuestion[]): readonly SessionQuestion[] => [
        ...questions.filter(
          (candidate: SessionQuestion): boolean => candidate.id !== question.id,
        ),
        question,
      ],
    );
  }

  /**
   * Finds a live question seen by this page instance.
   *
   * @param questionId Live question id to find.
   * @returns Matching live question, or null when missing.
   */
  private liveQuestion(questionId: string): SessionQuestion | null {
    return (
      this.liveQuestions().find(
        (question: SessionQuestion): boolean => question.id === questionId,
      ) ?? null
    );
  }

  /**
   * Returns the average score for evaluated answers.
   *
   * @param answers Evaluated answer list from the API.
   * @returns Average score, or 0 when no answers exist.
   */
  private averageScore(answers: readonly EvaluatedAnswer[]): number {
    if (!answers.length) {
      return 0;
    }

    return (
      answers.reduce(
        (total: number, answer: EvaluatedAnswer): number => total + answer.score,
        0,
      ) / answers.length
    );
  }

  /**
   * Resolves a live level from generated question ids when available.
   *
   * @param question Live question returned by the API.
   * @returns Best-effort live level for display.
   */
  private liveLevel(question: SessionQuestion): number {
    const match = question.id.match(/(?:^|-)l(\d+)(?:-|$)/i);

    if (match === null) {
      return 0;
    }

    return Number(match[1]);
  }

  /**
   * Resolves a live question number from generated question ids.
   *
   * @param question Live question returned by the API.
   * @returns Live question number within the current three-question set.
   */
  private liveQuestionNumber(question: SessionQuestion): number {
    const match = question.id.match(/(?:^|-)q(\d+)(?:-|$)/i);

    if (match === null) {
      return 1;
    }

    return Math.max(1, Math.min(this.liveQuestionTotal, Number(match[1])));
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
