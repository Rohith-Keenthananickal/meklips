import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormDataService } from '../../service/form-data.service';
import { DatePipe } from '@angular/common';
import { Candidate, EducationalDegree, WorkExperience } from '../../models/signup.models';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { SignupService } from '../../service/signup.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss'],
})
export class EducationComponent implements OnInit {
  public candidate = new Candidate();
  public educationalDegrees: EducationalDegree = new EducationalDegree();
  public formData = {};
  subscription: Subscription;
  public editable: boolean;
  public university: [];
  constructor(
    private router: Router,
    private formDataService: FormDataService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private signupService: SignupService
  ) {}

  ngOnInit(): void {
    this.getLocalData();
    console.log(this.candidate);
    this.candidate.educationalDegrees.push(this.educationalDegrees);
    this.getDegree();
    // this.candidate.workExperiences = this.workExperiences

    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        console.log(params);
        this.editable = params['edit'];
        console.log(this.editable);
      }
    );
    
  }

  getLocalData() {
    let localData = this.formDataService.getLocalData();
    this.candidate = localData;
    this.candidate.educationalDegrees = this.candidate.educationalDegrees || [];
  }

  getDegree() {
    this.signupService.getDegree().subscribe({
      next: (res: any) => {
        console.log(res);
        this.university = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  addEducation(): void {
    this.candidate.educationalDegrees.push(new EducationalDegree());
    // this.workExperiences = new WorkExperience();
  }

  updateFormData() {
    console.log(this.candidate);
    this.formDataService.updateFormData(this.candidate);
    // this.advancedView();
  }

  formatDate(selectedDate: any): string {
    // Convert the date to a JavaScript Date object
    const jsDate = new Date(selectedDate);

    // Use DatePipe to format the date
    const formattedDate = this.datePipe.transform(jsDate, 'yyyy-MM-dd');

    return formattedDate || '';
  }

  startDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(this.formatDate(event.value));
    // this.workExperiences.startDate = this.formatDate(event.value);
  }

  endDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    console.log(this.formatDate(event.value));
    this.educationalDegrees.graduationDate = this.formatDate(event.value);
  }

  advancedView() {
    this.updateFormData();
    this.router.navigate(['signup/skills']);
  }

  back() {
    this.router.navigate(['signup/previous-employment']);
  }

  updateEducation() {
    this.updateFormData();
    let payload = this.candidate.educationalDegrees;
    let candidateId = localStorage.getItem('userId');
    const filteredArray = payload.filter(
      (obj) => Object.keys(obj).length !== 0
    );
    console.log(filteredArray);

    filteredArray.forEach((item) => {
      if (item.id) {
        let id = item.id;
        let candidateId = item.candidateId;
        this.signupService.updateEducation(item, id, candidateId).subscribe({
          next: (res: any) => {
            console.log(res);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      } else {
        item.candidateId = Number(candidateId);
        this.signupService.newSkills(item).subscribe({
          next: (res: any) => {
            console.log(res);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
    });
    setInterval(() => {
      this.router.navigate(['profile']);
    }, 1000);
  }
}

