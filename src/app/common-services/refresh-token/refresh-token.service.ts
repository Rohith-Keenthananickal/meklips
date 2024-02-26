import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private refreshSubscription: Subscription | undefined;

  constructor(private authService: AuthService,
    private router:Router) {}

  startTokenRefresh() {
    // Clear existing subscription (if any)
    this.stopTokenRefresh();
    
    if(this.authService.isAuthenticated()){
        // Set up a new subscription to refresh the token every 50 minutes
      this.refreshSubscription = interval(50 * 60 * 1000).pipe(
        switchMap(() => this.authService.refreshToken())
      ).subscribe(
        () => console.log('Token refreshed successfully'),
        error => {
          console.error('Error refreshing token:', error);
          this.authService.logout();
          this.router.navigate(['login']);

        }
      );
    }
    
  }

  stopTokenRefresh() {
    // Unsubscribe from the refresh interval
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
