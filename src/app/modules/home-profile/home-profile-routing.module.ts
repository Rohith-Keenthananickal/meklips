import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileVideoComponent } from './pages/profile-video/profile-video.component';
import { CandidateProfileComponent } from './pages/profile/candidate-profile.component';
import { ProfileCardComponent } from './pages/profile-card/profile-card.component';

const routes: Routes = [
  {
    path: '',
    component:ProfileCardComponent
    // component: ProfileComponent
  },
  {
    path: 'card',
    component : ProfileCardComponent
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
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeProfileRoutingModule { }
