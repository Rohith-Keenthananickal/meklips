import { Component, OnInit } from '@angular/core';
import { RefreshTokenService } from './common-services/refresh-token/refresh-token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'meklips';
  constructor(private tokenRefreshService: RefreshTokenService){}

  ngOnInit() {
    this.tokenRefreshService.startTokenRefresh();
  }
}
