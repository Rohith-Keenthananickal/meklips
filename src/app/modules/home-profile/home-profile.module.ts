import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeProfileRoutingModule } from './home-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileVideoComponent } from './pages/profile-video/profile-video.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileVideoComponent
  ],
  imports: [
    CommonModule,
    HomeProfileRoutingModule,
    MatTooltipModule

  ]
})
export class HomeProfileModule { }
