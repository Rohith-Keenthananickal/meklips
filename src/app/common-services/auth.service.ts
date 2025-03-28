import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Login } from 'src/app/modules/login/models/login.models';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';

  constructor(private http: HttpClient) {}

  login(login : Login): Observable<any> {
    // return this.http.post<any>(`${environment.url}/login`, login,{ context: new HttpContext().set(BYPASS_INJECTION, true)}).pipe(
      return this.http.post<any>(`${environment.url}/users/login`, login).pipe(
      tap((tokens) => this.saveTokens(tokens)),
      catchError((error) => throwError(error)) // Handle login errors
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    return this.http.post<any>(`${environment.url}/refresh`, { refreshToken }).pipe(
      tap((tokens) => this.saveTokens(tokens)),
      catchError((error) => {
        // this.logout(); // Logout if token refresh fails
        return throwError(error);
      })
    );
  }

  private saveTokens(tokens: { tokenType: string; accessToken: string; expiresIn: number; refreshToken: string }): void {
    localStorage.setItem(this.accessTokenKey, tokens.accessToken);
    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.clear();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    return !!accessToken;
  }
}
