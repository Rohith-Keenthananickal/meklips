import { Component, Input } from '@angular/core';
import { Candidate } from 'src/app/modules/signup/models/signup.models';

@Component({
  selector: 'app-profile-preview',
  templateUrl: './profile-preview.component.html',
  styleUrls: ['./profile-preview.component.scss']
})
export class ProfilePreviewComponent {
  @Input() candidate: Candidate;
  @Input() imageUrl: string;
  @Input() selectedHighlight: number = 0;

  constructor() {}

  calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();
  
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
  
    // If the birthday hasn't occurred yet this year, subtract one year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
  
    return age;
  }
}
