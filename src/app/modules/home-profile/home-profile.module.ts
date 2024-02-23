import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeProfileRoutingModule } from './home-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    HomeProfileRoutingModule,
    MatSliderModule,
    MatProgressBarModule
  ]
})
export class HomeProfileModule { }
