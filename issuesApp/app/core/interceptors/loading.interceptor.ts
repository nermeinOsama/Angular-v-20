import { Injectable, signal } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

export const globalLoading = signal(false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    globalLoading.set(true);

    return next.handle(req).pipe(
      finalize(() => globalLoading.set(false)) // Reset when request completes
    );
  }
}