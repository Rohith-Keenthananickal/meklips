import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup/signup.component';
import { PasswordSetComponent } from './pages/password-set/password-set.component';
import { PersonalDetailsComponent } from './pages/personal-details/personal-details.component';
import { PreviousEmploymentComponent } from './pages/previous-employment/previous-employment.component';
import { CommonSectionComponent } from './components/common-section/common-section.component';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { EducationComponent } from './pages/education/education.component';
import { SkillsComponent } from './pages/skills/skills.component';
import {MatSliderModule} from '@angular/material/slider';
import { ProfileSummaryComponent } from './pages/profile-summary/profile-summary.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';


// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    SignupComponent,
    PasswordSetComponent,
    PersonalDetailsComponent,
    PreviousEmploymentComponent,
    CommonSectionComponent,
    EducationComponent,
    SkillsComponent,
    ProfileSummaryComponent,
    // DatePipe
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    MatDatepickerModule,
    MatSliderModule,
    NgxDropzoneModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    NgSelectModule
    // ToastrModule
  ]
})
export class SignupModule { }
