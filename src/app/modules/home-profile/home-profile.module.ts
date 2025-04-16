import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeProfileRoutingModule } from './home-profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileVideoComponent } from './pages/profile-video/profile-video.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CandidateProfileComponent } from './pages/profile/candidate-profile.component';
import { QRCodeModule } from 'angularx-qrcode';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { ProfileCardComponent } from './pages/profile-card/profile-card.component';
import { VideoPlayerModalComponent } from './components/video-player-modal/video-player-modal.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileVideoComponent,
    CandidateProfileComponent,
    ProfileCardComponent,
    VideoPlayerModalComponent
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
