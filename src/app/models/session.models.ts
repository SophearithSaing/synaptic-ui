import { Topic } from './topic.models';

export type SessionQuestionType = 'mcq' | 'written';

export interface SessionQuestionOption {
  readonly id: string;
  readonly text: string;
}

export interface SessionQuestionFeedback {
  readonly correct: string;
  readonly incorrect: string;
}

export interface SessionQuestionRubrics {
  readonly keyPoints: readonly string[];
  readonly misconceptions: readonly string[];
}

export interface SessionQuestion {
  readonly id: string;
  readonly type: SessionQuestionType;
  readonly prompt: string;
  readonly options: readonly SessionQuestionOption[];
  readonly correctOptionId?: string;
  readonly targetConcepts: readonly string[];
  readonly feedback: SessionQuestionFeedback;
  readonly rubrics: SessionQuestionRubrics;
}

export interface QuestionSet {
  readonly id: string;
  readonly topic: string | Topic;
  readonly setType: string;
  readonly level: number;
  readonly questions: readonly SessionQuestion[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface SessionAnswerSubmission {
  readonly questionId: string;
  readonly answer: string;
}

export interface EvaluatedAnswer {
  readonly id: string;
  readonly questionId: string;
  readonly questionType: SessionQuestionType;
  readonly answer: string;
  readonly correctAnswer: string;
  readonly score: number;
  readonly feedback: string;
  readonly targetConcepts: readonly string[];
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly evaluatedBy: 'system' | 'ai';
}

export interface SessionOverallEvaluation {
  readonly summary: string;
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly recommendations: readonly string[];
}

export interface SetAttempt {
  readonly id: string;
  readonly user: string;
  readonly session: string;
  readonly topic: string;
  readonly questionSet: string;
  readonly level: number;
  readonly answers: readonly EvaluatedAnswer[];
  readonly setScore: number;
  readonly passed: boolean;
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly aiSummary?: string;
  readonly submittedAt: string;
  readonly evaluatedAt: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface StartSessionResponse {
  readonly sessionId: string;
  readonly questionSet: QuestionSet;
}

export interface InProgressSession {
  readonly id: string;
  readonly student: string;
  readonly topic: Topic;
  readonly currentLevel: number;
  readonly status: string;
  readonly overallEvaluation?: SessionOverallEvaluation;
  readonly startAt?: string;
  readonly finishAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface SessionSubmitResponse {
  readonly attempt: SetAttempt;
  readonly nextQuestionSet: QuestionSet | null;
}
