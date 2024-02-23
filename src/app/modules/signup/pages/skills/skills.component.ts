import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Candidate, CandidateSkill, SocialMediaLink } from '../../models/signup.models';
import { FormDataService } from '../../service/form-data.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SignupService } from '../../service/signup.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  public candidate = new Candidate();
  public socialMediaLinks : SocialMediaLink = new SocialMediaLink();
  public candidateSkills : CandidateSkill = new CandidateSkill();
  public formData = {}
  subscription:Subscription;
  public editable : boolean



  constructor(private router:Router,
    private formDataService: FormDataService,
    private datePipe: DatePipe,
    private signupService : SignupService,
    private activeRoute:ActivatedRoute){

  }

  ngOnInit(): void {
    this.getLocalData();
    // console.log(this.candidate);
    this.candidate.socialMediaLinks.push(this.socialMediaLinks)
    this.candidate.candidateSkills.push(this.candidateSkills)

    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        console.log(params);
        this.editable = params['edit'];
        console.log(this.editable);
        
      });

  }
  
  getLocalData(){
    let localData = this.formDataService.getLocalData();
    this.candidate = localData
    this.candidate.socialMediaLinks = this.candidate.socialMediaLinks || [];
    this.candidate.candidateSkills = this.candidate.candidateSkills || [];
  }

  addsocialMediaLinks(): void {
    this.candidate.socialMediaLinks.push(new SocialMediaLink());
    
    // this.workExperiences = new WorkExperience();
  }

  addSkills(){
    this.candidate.candidateSkills.push(new CandidateSkill());
    this.updateFormData();
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


  advancedView(){
    // this.addsocialMediaLinks();
    this.updateFormData();
    this.router.navigate(['signup/profile-summary']);
    
  }

  back(){
    this.router.navigate(['signup/education']);
  }


  formatLabel(value: number): string {
    return `${value}%`;
  }

  updateSkills(){
    this.updateFormData();
    let payload = this.candidate.candidateSkills;
    let candidateId = localStorage.getItem('userId')
    const filteredArray = payload.filter(obj => Object.keys(obj).length !== 0);
    console.log(filteredArray);
    
    filteredArray.forEach((item)=>{
      if(item.id){
        let id = item.id;
        let candidateId = item.candidateId;
        this.signupService.updateSkills(item,id,candidateId).subscribe({
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
        this.signupService.newSkills(item).subscribe({
          next:(res:any)=>{
            console.log(res);
            
          },
          error:(err : any)=>{
            console.log(err);
            
          }
        });
      }
      
    });
    setInterval(()=>{
      this.router.navigate(['profile']);
    },1000)
    
  }


}




