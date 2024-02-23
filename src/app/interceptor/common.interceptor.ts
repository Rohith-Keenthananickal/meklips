import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpContextToken } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../common-services/auth.service';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this.authService.isAuthenticated()) {
      request = this.addToken(request, this.authService.getAccessToken()!);
    }

    // if (request.context.get(BYPASS_INJECTION) === true) return next.handle(req);

    return next.handle(request).pipe(
      catchError((error) => {
        // Handle authentication errors, e.g., token expired
        if (error.status === 401) {
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
      catchError((error) => {
        // Handle refresh token failure
        this.authService.logout();
        return throwError(error);
      })
    );
  }
}
export const BYPASS_INJECTION = new HttpContextToken(() => false);