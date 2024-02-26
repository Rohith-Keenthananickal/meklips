import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormDataService } from '../../service/form-data.service';
import { Candidate, WorkExperience } from '../../models/signup.models';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { SignupService } from '../../service/signup.service';

@Component({
  selector: 'app-previous-employment',
  templateUrl: './previous-employment.component.html',
  styleUrls: ['./previous-employment.component.scss']
})
export class PreviousEmploymentComponent implements OnInit {
  public candidate = new Candidate();
  public workExperiences : WorkExperience = new WorkExperience()
  public formData = {}
  subscription:Subscription;
  public editable : boolean

  constructor(private router:Router,
    private formDataService: FormDataService,
    private datePipe: DatePipe,
    private activeRoute:ActivatedRoute,
    private signupService : SignupService){

  }
  ngOnInit(): void {
    this.getLocalData();
    console.log(this.candidate);
    this.candidate.workExperiences.push(this.workExperiences)
    
    // this.candidate.workExperiences = this.workExperiences

    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        console.log(params);
        this.editable = params['edit'];
        console.log(this.editable);
        
      });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  getLocalData(){
    let localData = this.formDataService.getLocalData();
    this.candidate = localData
    this.candidate.workExperiences = this.candidate.workExperiences || [];
  }

  addWorkExperience(): void {
    this.candidate.workExperiences.push(new WorkExperience());
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


  startDate(type: string, event: MatDatepickerInputEvent<Date>, i) {
    console.log(this.formatDate(event.value));
    console.log(this.workExperiences[i]);
    
    this.candidate.workExperiences[i].startDate = this.formatDate(event.value);
     
  }

  endDate(type: string, event: MatDatepickerInputEvent<Date>, i) {
    console.log(event.value);
    console.log(this.formatDate(event.value));
    this.candidate.workExperiences[i].endDate = this.formatDate(event.value);
  }

  advancedView(){
    // this.addWorkExperience();
    this.updateFormData();
    this.router.navigate(['signup/education']);
  }

  back(){
    this.router.navigate(['signup/personal-details']);
  }


  updateWorkExperiance(){
    this.updateFormData();
    let payload = this.candidate.workExperiences;
    let candidateId = localStorage.getItem('userId')
    const filteredArray = payload.filter(obj => Object.keys(obj).length !== 0);
    console.log(filteredArray);
    
    filteredArray.forEach((item)=>{
      if(item.id){
        let id = item.id;
        let candidateId = item.candidateId;
        this.signupService.updateWorkExperiance(item,id,candidateId).subscribe({
          next:(res:any)=>{
            console.log(res);
            
          },
          error:(err : any)=>{
            console.log(err);
            
          }
        });
      }
      else{
        item.candidateId = Number(candidateId)
        this.signupService.AddWorkExperiance(item).subscribe({
          next:(res:any)=>{
            console.log(res);
            
          },
          error:(err : any)=>{
            console.log(err);
            
          }
        });
      }
      
    });
    setTimeout(()=>{
      this.router.navigate(['profile']);
    },1000)
    
  }
}
