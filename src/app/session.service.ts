import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap, throwError } from 'rxjs';

import { AuthSessionService } from './auth-session.service';
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
  private readonly sessionStoragePrefix = 'synaptic.session.';

  public constructor(
    private readonly http: HttpClient,
    private readonly authSession: AuthSessionService,
  ) {}

  /**
   * Starts a session for the selected topic.
   *
   * @param topic Topic selected by the student.
   * @returns Observable of the first question set.
   */
  public startSession(topic: Topic): Observable<QuestionSet> {
    const headers = this.requiredAuthHeaders();

    if (headers === null) {
      return throwError((): Error => new Error('Authentication is required.'));
    }

    return this.http
      .post<StartSessionResponse>(
        `${API_BASE_URL}/sessions/start`,
        { topicId: topic._id },
        { headers },
      )
      .pipe(
        tap((response: StartSessionResponse): void => {
          this.storeSessionId(topic._id, response.sessionId);
        }),
        map((response: StartSessionResponse): QuestionSet => response.questionSet),
      );
  }

  /**
   * Loads active sessions for the authenticated user.
   *
   * @returns Observable of active in-progress sessions.
   */
  public loadInProgressSessions(): Observable<readonly InProgressSession[]> {
    const headers = this.requiredAuthHeaders();

    if (headers === null) {
      return throwError((): Error => new Error('Authentication is required.'));
    }

    return this.http
      .get<readonly InProgressSession[]>(
        `${API_BASE_URL}/sessions/in-progress`,
        { headers },
      )
      .pipe(
        tap((sessions: readonly InProgressSession[]): void => {
          sessions.forEach((session: InProgressSession): void => {
            this.storeSessionId(session.topic._id, session.id);
          });
        }),
      );
  }

  /**
   * Continues an existing session for the selected topic.
   *
   * @param topic Topic selected by the student.
   * @returns Observable of the current question set.
   */
  public continueSession(
    topic: Topic,
    activeSessionId: string | null = null,
  ): Observable<QuestionSet> {
    const headers = this.requiredAuthHeaders();
    const sessionId = activeSessionId ?? this.sessionId(topic._id);

    if (headers === null) {
      return throwError((): Error => new Error('Authentication is required.'));
    }

    if (sessionId === null) {
      return throwError(
        (): Error => new Error('No saved session exists for this topic.'),
      );
    }

    return this.http
      .post<QuestionSet>(
        `${API_BASE_URL}/sessions/continue`,
        { sessionId },
        { headers },
      )
      .pipe(
        tap((): void => {
          this.storeSessionId(topic._id, sessionId);
        }),
      );
  }

  /**
   * Submits answers for a question set.
   *
   * @param topic Topic being practiced.
   * @param questionSet Question set answered by the student.
   * @param answers Student answer submissions.
   * @returns Observable of evaluated feedback.
   */
  public submitAnswers(
    topic: Topic,
    questionSet: QuestionSet,
    answers: readonly SessionAnswerSubmission[],
  ): Observable<SessionSubmitResponse> {
    const headers = this.requiredAuthHeaders();
    const sessionId = this.sessionId(topic._id);

    if (headers === null) {
      return throwError((): Error => new Error('Authentication is required.'));
    }

    if (sessionId === null) {
      return throwError(
        (): Error =>
          new Error('The API did not provide a session id for submission.'),
      );
    }

    return this.http.post<SessionSubmitResponse>(
      `${API_BASE_URL}/sessions/submit-answer`,
      {
        sessionId,
        questionSetId: questionSet.id,
        answers,
      },
      { headers },
    );
  }

  /**
   * Persists a returned session id for later continue and submit calls.
   *
   * @param topicId Topic id associated with the session.
   * @param questionSet API question set response.
   */
  private storeSessionId(topicId: string, sessionId: string): void {
    localStorage.setItem(this.sessionStorageKey(topicId), sessionId);
  }

  /**
   * Reads a saved session id for a topic.
   *
   * @param topicId Topic id associated with the session.
   * @returns Saved session id, or null when missing.
   */
  private sessionId(topicId: string): string | null {
    return localStorage.getItem(this.sessionStorageKey(topicId));
  }

  /**
   * Builds the local storage key for a topic session.
   *
   * @param topicId Topic id associated with the session.
   * @returns Storage key for the topic session id.
   */
  private sessionStorageKey(topicId: string): string {
    return `${this.sessionStoragePrefix}${topicId}`;
  }

  /**
   * Builds authenticated API headers when a bearer token exists.
   *
   * @returns HTTP headers with bearer auth, or null when no token exists.
   */
  private requiredAuthHeaders(): HttpHeaders | null {
    const token = this.authSession.accessToken();

    if (token === null) {
      return null;
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
