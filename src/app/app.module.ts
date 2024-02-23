import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonInterceptor } from './interceptor/common.interceptor';
import { AuthService } from './common-services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatNativeDateModule} from '@angular/material/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    HttpClientModule,
    NgSelectModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass :'toast-bottom-right'
    })
  ],
  providers: [AuthService,DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CommonInterceptor,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
