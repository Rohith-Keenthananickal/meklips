import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileVideoComponent } from './pages/profile-video/profile-video.component';
import { CandidateProfileComponent } from './pages/profile/candidate-profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path:'video',
    component: ProfileVideoComponent
  },
  {
    path:':id/video',
    component: ProfileVideoComponent
  },
  {
    path:':id',
    component: CandidateProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeProfileRoutingModule { }
