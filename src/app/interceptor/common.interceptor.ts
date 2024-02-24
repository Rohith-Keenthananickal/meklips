import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpContextToken,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap, retryWhen, delay, take } from 'rxjs/operators';
import { AuthService } from '../common-services/auth.service';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.isAuthenticated()) {
      request = this.addToken(request, this.authService.getAccessToken()!);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handleUnauthorizedError(request, next);
        }
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return this.authService.refreshToken().pipe(
      switchMap(() => {
        const newAccessToken = this.authService.getAccessToken()!;
        request = this.addToken(request, newAccessToken);
        return next.handle(request);
      }),
      catchError((refreshError) => {
        this.authService.logout();
        return throwError(refreshError);
      }),
      retryWhen(errors => errors.pipe(
        // You can customize the retry strategy here
        delay(1000), // delay for 1 second
        take(3) // retry 3 times
      )),
      catchError(() => {
        // Log or handle the final error
        return EMPTY; // return an empty observable to complete the observable chain
      })
    );
  }
}
