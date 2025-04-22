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
}
