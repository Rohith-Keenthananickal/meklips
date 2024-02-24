import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormDataService } from '../../service/form-data.service';
import { Candidate, CurrentAddress } from '../../models/signup.models';
import { SignupService } from '../../service/signup.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit{
  public candidate = new Candidate();
  public currentAddress = new CurrentAddress();
  public formData = {}
  subscription:Subscription;
  public editable : boolean

  constructor(private router:Router,
    private formDataService: FormDataService,
    private signupService : SignupService,
    private datePipe: DatePipe,
    private activeRoute:ActivatedRoute){

  }
  ngOnInit(): void {
    this.getLocalData();
    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        console.log(params);
        this.editable = params['edit'];
        console.log(this.editable);
        
      });

    // this.getUserId();
    this.candidate.currentAddress=this.currentAddress
  }
  
  getLocalData(){
    let localData = this.formDataService.getLocalData();
    this.candidate = localData
  }

  updateFormData() {
    
    this.formDataService.updateFormData(this.candidate);
    // this.formDataService.updateFormData(this.currentAddress);
    this.advancedView();
  }

  formatDate(selectedDate: any): string {
    // Convert the date to a JavaScript Date object
    const jsDate = new Date(selectedDate);

    // Use DatePipe to format the date
    const formattedDate = this.datePipe.transform(jsDate, 'yyyy-MM-dd');

    return formattedDate || '';
  }


  dob(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(this.formatDate(event.value));
    this.candidate.dob = this.formatDate(event.value);
  }

  advancedView(){
    this.router.navigate(['signup/previous-employment']);
  }

  validateData() {
    if (
      this.notNullAndUndefined(this.candidate.firstName) &&
      this.notNullAndUndefined(this.candidate.lastName) &&
      this.notNullAndUndefined(this.candidate.email) &&
      this.notNullAndUndefined(this.candidate.currentAddress) &&
      this.notNullAndUndefined(this.candidate.phone) &&
      this.notNullAndUndefined(this.candidate.mobile) &&
      this.notNullAndUndefined(this.candidate.dob) &&
      this.notNullAndUndefined(this.candidate.gender)
    ) {
     return true
    } else {
      return false
    }
  }

  updateProfile(){
    console.log(this.candidate);
    let id = localStorage.getItem('userId')
    let payload = this.candidate
    delete payload.dpId;
    delete payload.videoId;

    this.signupService.updateCandidate(payload,id).subscribe({
      next:(res:any)=>{
        console.log(res);
        setInterval(()=>{
          this.router.navigate(['profile']);
        },1000)
      },
      error:(err : any)=>{
        console.log(err);
        
      }
    })
  }

  private notNullAndUndefined(value: any): boolean {
    return value !== null && value !== undefined;
  }
}
