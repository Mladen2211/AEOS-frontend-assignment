import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { API_CONSTANTS, RATE_LIMIT_CONSTANTS, RETRY_CONSTANTS } from './constants/app.constants';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({
      setHeaders: {
        'User-Agent': API_CONSTANTS.USER_AGENT,
        'Accept': 'application/json'
      }
    });

    return next.handle(modifiedReq).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          const rateRemaining = event.headers.get('x-ratelimit-remaining');

          if (rateRemaining !== null) {
            const remaining = parseInt(rateRemaining, 10);
            // Rate limit monitoring - could be used for UI feedback in the future
            const isWarning = remaining < RATE_LIMIT_CONSTANTS.WARNING_THRESHOLD;
            const isCritical = remaining < RATE_LIMIT_CONSTANTS.CRITICAL_THRESHOLD;
            // Future enhancement: emit rate limit status to a service for UI updates
          }
        }
      }),
      retry({
        count: RETRY_CONSTANTS.MAX_RETRIES,
        delay: (error, retryCount) => {
          if (error instanceof HttpErrorResponse && error.status === 429) {
            const delayMs = Math.pow(2, retryCount) * RETRY_CONSTANTS.RATE_LIMIT_BASE_DELAY_MS;
            return timer(delayMs);
          }
          if (error instanceof HttpErrorResponse && error.status >= 500) {
            const delayMs = Math.pow(2, retryCount) * RETRY_CONSTANTS.SERVER_ERROR_BASE_DELAY_MS;
            return timer(delayMs);
          }
          throw error;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          if (error.status === 429) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
          } else if (error.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
        }
        console.error('HTTP Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}