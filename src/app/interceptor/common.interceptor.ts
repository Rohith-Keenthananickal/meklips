import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../common-services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("Test Refresh");
    
    if (this.authService.isAuthenticated()) {
      request = this.addToken(request, this.authService.getAccessToken()!);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // return this.handleUnauthorizedError(request, next);
          this.router.navigate(['login']);
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

  // private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
  //   return this.authService.refreshToken().pipe(
  //     switchMap(() => {
  //       const newAccessToken = this.authService.getAccessToken()!;
  //       request = this.addToken(request, newAccessToken);
  //       return next.handle(request);
  //     }),
  //     catchError((refreshError) => {
  //       if (refreshError instanceof HttpErrorResponse && refreshError.status === 401) {
  //         // Handle 401 during token refresh
  //         this.authService.logout();
  //         this.router.navigate(['/login']);
  //       } else {
  //         // Handle other errors during token refresh
  //         this.authService.logout();
  //       }
  //       return throwError(refreshError);
  //     }),
  //     catchError(() => {
  //       // Log or handle the final error
  //       return EMPTY; // return an empty observable to complete the observable chain
  //     })
  //   );
  // }
}
