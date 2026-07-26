import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  InProgressSession,
  LiveQuestionResponse,
  LiveSessionSubmitResponse,
  QuestionSet,
  SessionAnswerSubmission,
  SessionSubmitResponse,
  StartSessionResponse,
} from './models/session.models';
import { Topic } from './models/topic.models';
import { environment } from '../environments/environment';

const API_BASE_URL = environment.API_BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public constructor(private readonly http: HttpClient) {}

  /**
   * Starts a new session for the selected topic.
   *
   * @param topic Topic selected by the student.
   * @returns Observable of the created session and first question set.
   */
  public startSession(topic: Topic): Observable<StartSessionResponse> {
    return this.http.post<StartSessionResponse>(
      `${API_BASE_URL}/sessions/start`,
      { topicId: topic.id },
    );
  }

  /**
   * Starts a new live session for the selected topic.
   *
   * @param topic Topic selected by the student.
   * @returns Observable of the live session and pending question.
   */
  public startLiveSession(topic: Topic): Observable<LiveQuestionResponse> {
    return this.http.post<LiveQuestionResponse>(
      `${API_BASE_URL}/sessions/live/start`,
      { topicId: topic.id },
    );
  }

  /**
   * Loads active sessions for the authenticated user.
   *
   * @returns Observable of active in-progress sessions.
   */
  public loadInProgressSessions(): Observable<readonly InProgressSession[]> {
    return this.http.get<readonly InProgressSession[]>(
      `${API_BASE_URL}/sessions/in-progress`,
    );
  }

  /**
   * Loads active live sessions for the authenticated user.
   *
   * @returns Observable of active live in-progress sessions.
   */
  public loadLiveInProgressSessions(): Observable<readonly InProgressSession[]> {
    return this.http.get<readonly InProgressSession[]>(
      `${API_BASE_URL}/sessions/live/in-progress`,
    );
  }

  /**
   * Deletes an existing session by id.
   *
   * @param sessionId Session id to delete.
   * @returns Observable completing when the session is deleted.
   */
  public deleteSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/sessions/${sessionId}`);
  }

  /**
   * Deletes an existing live session by id.
   *
   * @param sessionId Live session id to delete.
   * @returns Observable completing when the live session is deleted.
   */
  public deleteLiveSession(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/sessions/live/${sessionId}`);
  }

  /**
   * Continues an existing session by id.
   *
   * @param sessionId Session id to continue.
   * @returns Observable of the current question set.
   */
  public continueSession(sessionId: string): Observable<QuestionSet> {
    return this.http.post<QuestionSet>(`${API_BASE_URL}/sessions/continue`, {
      sessionId,
    });
  }

  /**
   * Continues an existing live session by id.
   *
   * @param sessionId Live session id to continue.
   * @returns Observable of the current or next pending live question.
   */
  public continueLiveSession(sessionId: string): Observable<LiveQuestionResponse> {
    return this.http.post<LiveQuestionResponse>(
      `${API_BASE_URL}/sessions/live/continue`,
      {
        sessionId,
      },
    );
  }

  /**
   * Rejects the current pending live question and requests a replacement.
   *
   * @param sessionId Live session id associated with the question.
   * @param questionId Live question id returned by the API.
   * @param reason Student reason for rejecting the question.
   * @returns Observable of the replacement pending live question.
   */
  public rejectLiveQuestion(
    sessionId: string,
    questionId: string,
    reason: string,
  ): Observable<LiveQuestionResponse> {
    return this.http.post<LiveQuestionResponse>(
      `${API_BASE_URL}/sessions/live/reject`,
      {
        questionId,
        reason,
        sessionId,
      },
    );
  }

  /**
   * Submits answers for a question set.
   *
   * @param sessionId Session id associated with the question set.
   * @param questionSet Question set answered by the student.
   * @param answers Student answer submissions.
   * @returns Observable of evaluated feedback.
   */
  public submitAnswers(
    sessionId: string,
    questionSet: QuestionSet,
    answers: readonly SessionAnswerSubmission[],
  ): Observable<SessionSubmitResponse> {
    return this.http.post<SessionSubmitResponse>(
      `${API_BASE_URL}/sessions/submit-answer`,
      {
        sessionId,
        questionSetId: questionSet.id,
        answers,
      },
    );
  }

  /**
   * Submits one live session answer for evaluation.
   *
   * @param sessionId Live session id associated with the question.
   * @param questionId Live question id returned by the API.
   * @param answer Student answer text or selected option id.
   * @returns Observable of evaluated feedback and next live question.
   */
  public submitLiveAnswer(
    sessionId: string,
    questionId: string,
    answer: string,
  ): Observable<LiveSessionSubmitResponse> {
    return this.http.post<LiveSessionSubmitResponse>(
      `${API_BASE_URL}/sessions/live/submit-answer`,
      {
        answer,
        questionId,
        sessionId,
      },
    );
  }
}
