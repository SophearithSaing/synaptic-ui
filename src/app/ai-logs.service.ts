import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { AiLogPage } from './models/ai-log.models';

const API_BASE_URL = environment.API_BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class AiLogsService {
  public constructor(private readonly http: HttpClient) {}

  /**
   * Loads one paginated page of AI completion logs.
   *
   * @param page One-based page number to request.
   * @param limit Maximum number of logs to return.
   * @returns Observable containing the requested log page.
   */
  public loadLogs(page: number, limit: number): Observable<AiLogPage> {
    const params = new HttpParams().set('page', page).set('limit', limit);

    return this.http.get<AiLogPage>(`${API_BASE_URL}/ai/logs`, { params });
  }
}
