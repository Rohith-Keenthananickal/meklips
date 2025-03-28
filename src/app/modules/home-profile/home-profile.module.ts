import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeProfileRoutingModule } from './home-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileVideoComponent } from './pages/profile-video/profile-video.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CandidateProfileComponent } from './pages/profile/candidate-profile.component';
import { QRCodeModule } from 'angularx-qrcode';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { ProfileNewUiComponent } from './pages/profile-new-ui/profile-new-ui.component';
import { ProfileCardComponent } from './pages/profile-card/profile-card.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileVideoComponent,
    CandidateProfileComponent,
    ProfileNewUiComponent,
    ProfileCardComponent
  ],
  imports: [
    CommonModule,
    HomeProfileRoutingModule,
    MatTooltipModule,
    QRCodeModule,
    ClipboardModule,

  ]
})
export class HomeProfileModule { }
