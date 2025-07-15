import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfileVideoComponent } from './pages/profile-video/profile-video.component';
import { CandidateProfileComponent } from './pages/profile/candidate-profile.component';
import { ProfileCardComponent } from './pages/profile-card/profile-card.component';
import { CandidateNotFoundComponent } from './pages/candidate-not-found/candidate-not-found.component';

const routes: Routes = [
  { path: '', component: ProfileCardComponent },
  { path: 'not-found', component: CandidateNotFoundComponent },
  { path: 'card', component: ProfileCardComponent },
  { path: 'video', component: ProfileVideoComponent },
  { path: 'candidate/:uuid', component: ProfileCardComponent },
  { path: ':id/video', component: ProfileVideoComponent },
  { path: ':uuid', component: ProfileCardComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeProfileRoutingModule { }
