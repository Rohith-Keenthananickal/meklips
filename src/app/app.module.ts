import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonInterceptor } from './interceptor/common.interceptor';
import { AuthService } from './common-services/auth.service';
import { RefreshTokenService } from './common-services/refresh-token/refresh-token.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatNativeDateModule} from '@angular/material/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { UploadWidgetModule } from '@bytescale/upload-widget-angular';
import { DeleteConformationComponent } from './common/components/delete-conformation/delete-conformation.component';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    DeleteConformationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    UploadWidgetModule,
    NgbPaginationModule, 
    NgbAlertModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [AuthService,DatePipe,RefreshTokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonInterceptor,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
