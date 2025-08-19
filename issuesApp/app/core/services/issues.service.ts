import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap, catchError, of } from 'rxjs';
import { Issue, CreateIssueRequest, UpdateIssueRequest,  IssuesFilter } from '../models/issue.model';



@Injectable({
  providedIn: 'root'
})
export class IssuesService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/issues';

  // State management using signals
  issues = signal<Issue[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  getIssues(filter: IssuesFilter = {}): Observable<Issue[]> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();

    if (filter.search) {
      params = params.set('q', filter.search);
    }

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    if (filter.page) {
      params = params.set('_page', filter.page.toString());
    }

    if (filter.limit) {
      params = params.set('_limit', filter.limit.toString());
    }

    params = params.set('_sort', 'updatedAt');
    params = params.set('_order', 'desc');

    return this.http.get<Issue[]>(this.baseUrl, { params }).pipe(
      tap(issues => {
        this.issues.set(issues);
        this.loading.set(false);
      }),
      catchError(error => {
        this.error.set('Failed to load issues. Please try again.');
        this.loading.set(false);
        return of([]);
      })
    );
  }

  getIssueById(id:  number | string): Observable<Issue | null> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<Issue>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loading.set(false)),
      catchError(error => {
        this.error.set('Issue not found or failed to load.');
        this.loading.set(false);
        return of(null);
      })
    );
  }

  createIssue(issueData: CreateIssueRequest): Observable<Issue | null> {
    this.loading.set(true);
    this.error.set(null);

    const newIssue = {
      ...issueData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Issue>(this.baseUrl, newIssue).pipe(
      tap(issue => {
        const currentIssues = this.issues();
        this.issues.set([issue, ...currentIssues]);
        this.loading.set(false);
      }),
      catchError(error => {
        this.error.set('Failed to create issue. Please try again.');
        this.loading.set(false);
        return of(null);
      })
    );
  }

  updateIssue(id: number |string, issueData: Partial<CreateIssueRequest>): Observable<Issue | null> {
    this.loading.set(true);
    this.error.set(null);

    const updateData = {
      ...issueData,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<Issue>(`${this.baseUrl}/${id}`, updateData).pipe(
      tap(updatedIssue => {
        const currentIssues = this.issues();
        const updatedIssues = currentIssues.map(issue =>
          issue.id === id ? updatedIssue : issue
        );
        this.issues.set(updatedIssues);
        this.loading.set(false);
      }),
      catchError(error => {
        this.error.set('Failed to update issue. Please try again.');
        this.loading.set(false);
        return of(null);
      })
    );
  }

  deleteIssue(id: number): Observable<boolean> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => {
        const currentIssues = this.issues();
        const filteredIssues = currentIssues.filter(issue => issue.id !== id);
        this.issues.set(filteredIssues);
        this.loading.set(false);
        return true;
      }),
      catchError(error => {
        this.error.set('Failed to delete issue. Please try again.');
        this.loading.set(false);
        return of(false);
      })
    );
  }

  clearError(): void {
    this.error.set(null);
  }
}

