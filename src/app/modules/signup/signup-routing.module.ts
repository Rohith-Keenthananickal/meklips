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

const routes: Routes = [
  {
    path: '',
    component : SignupComponent
  },
  {
    path: 'password-update',
    component: PasswordSetComponent
  },
  {
    path: 'user-details',
    component: CommonSectionComponent
  },
  {
    path: 'personal-details',
    component: PersonalDetailsComponent
  },
  {
    path : 'previous-employment',
    component : PreviousEmploymentComponent
  },
  {
    path: 'education',
    component: EducationComponent
  },
  {
    path: 'skills',
    component: SkillsComponent
  },
  {
    path: 'profile-summary',
    component : ProfileSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignupRoutingModule { }
