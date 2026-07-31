import { SessionQuestion } from './session.models';

export type AiLogQuestionStatus = 'pending' | 'rejected' | 'passed' | 'failed';

export interface AiLogLiveQuestion {
  readonly id: string;
  readonly level: number;
  readonly question: SessionQuestion;
  readonly questionNumber: number;
  readonly status: AiLogQuestionStatus;
}

export interface AiLog {
  readonly aiModel: string;
  readonly createdAt: string;
  readonly id: string;
  readonly liveQuestion: AiLogLiveQuestion | null;
  readonly operation: string;
  readonly output: string;
  readonly prompt: string;
}

export interface AiLogPage {
  readonly items: readonly AiLog[];
  readonly limit: number;
  readonly page: number;
  readonly total: number;
}
