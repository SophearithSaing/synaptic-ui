import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  InProgressSession,
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
}
