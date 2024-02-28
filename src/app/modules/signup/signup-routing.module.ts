import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { PasswordSetComponent } from './pages/password-set/password-set.component';
import { PersonalDetailsComponent } from './pages/personal-details/personal-details.component';
import { CommonSectionComponent } from './components/common-section/common-section.component';
import { PreviousEmploymentComponent } from './pages/previous-employment/previous-employment.component';
import { EducationComponent } from './pages/education/education.component';
import { SkillsComponent } from './pages/skills/skills.component';
import { ProfileSummaryComponent } from './pages/profile-summary/profile-summary.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component : SignupComponent
  },
  {
    path: 'password-update',
    component: PasswordSetComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'user-details',
  //   component: CommonSectionComponent
  // },
  {
    path: 'personal-details',
    component: PersonalDetailsComponent,
    // canActivate: [AuthGuard]
  },
  {
    path : 'previous-employment',
    component : PreviousEmploymentComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'education',
    component: EducationComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'skills',
    component: SkillsComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'profile-summary',
    component : ProfileSummaryComponent,
    // canActivate: [AuthGuard]
  },
  // {
  //   path: 'common',
  //   component : CommonSectionComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule { }
