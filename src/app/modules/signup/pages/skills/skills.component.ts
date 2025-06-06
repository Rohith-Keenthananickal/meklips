import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Candidate, CandidateSkill, SocialMediaLink } from '../../models/signup.models';
import { FormDataService } from '../../service/form-data.service';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SignupService } from '../../service/signup.service';
import { Subscription, isEmpty } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConformationComponent } from 'src/app/common/components/delete-conformation/delete-conformation.component';

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
  private modalRef: NgbModalRef;
  public website = new SocialMediaLink();
  public github = new SocialMediaLink();
  public facebook = new SocialMediaLink();
  public instagram = new SocialMediaLink();
  public twitter = new SocialMediaLink();
  public linkedIn = new SocialMediaLink();
  public loaderMessage = '';
  public loader : boolean;


  constructor(private router:Router,
    private formDataService: FormDataService,
    private datePipe: DatePipe,
    private signupService : SignupService,
    private activeRoute:ActivatedRoute,
    private toastr: ToastrService,
    private modalService: NgbModal){

  }

  ngOnInit(): void {
    this.getLocalData();
    // console.log(this.candidate);
    // if(this.candidate.socialMediaLinks.length == 0){
    //   this.candidate.socialMediaLinks.push(this.socialMediaLinks)

    // }
    if(this.candidate.candidateSkills.length == 0){
      this.candidate.candidateSkills.push(this.candidateSkills)
    }
    this.website.type= "WEBSITE"
    this.instagram.type= "INSTAGRAM"
    this.facebook.type= "FACEBOOK"
    this.github.type= "GITHUB"
    this.linkedIn.type = "LINKEDIN"
    this.twitter.type = "TWITTER"
    
    
    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        console.log('Query Params:', params);
        this.editable = params['edit'];
        console.log('Editable:', this.editable);
        
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
    this.candidate.candidateSkills = this.candidate.candidateSkills || [];
    this.candidate.socialMediaLinks.forEach((item)=>{
      if(item.type == 'INSTAGRAM'){
        this.instagram.url = item.url
      }
      if(item.type == 'FACEBOOK'){
        this.facebook.url = item.url
      }
      if(item.type == 'TWITTER'){
        this.twitter.url = item.url
      }
      if(item.type == 'WEBSITE'){
        this.website.url = item.url
      }
      if(item.type == 'GITHUB'){
        this.github.url = item.url
      }
      if(item.type == 'LINKEDIN'){
        this.linkedIn.url = item.url
      }
    })
  }

  addsocialMediaLinks(): void {
    this.candidate.socialMediaLinks.push(new SocialMediaLink());
    
    // this.workExperiences = new WorkExperience();
  }

  deleteSocialMedia(i : number){
    this.modalRef = this.modalService.open(DeleteConformationComponent, {
      size: 'sm',
    });
    this.modalRef.componentInstance.warningSubject = `You want to Delete this Social Media`;
    this.modalRef.result
      .then((result) => {
        console.log(result);
        this.candidate.socialMediaLinks.splice(i, 1);
        
      })
      .catch((reason) => {});
  }

  deleteSkills(index : number ,id :string){
    this.modalRef = this.modalService.open(DeleteConformationComponent, {
      size: 'sm',
    });
    this.modalRef.componentInstance.warningSubject = `You want to Delete this Skill`;
    this.modalRef.result
      .then((result) => {
        console.log(result);
        if(id){
          this.signupService.deleteSkill(id).subscribe({
            next:(res:any)=>{
              console.log(res);
              this.candidate.candidateSkills.splice(index, 1);
              this.toastr.success('Skill Deleted', 'Success', {
                positionClass: 'toast-top-right',
              });
            },
            error:(err:any)=>{
              console.log(err);
              this.toastr.error('Failed to Delete Skill ', 'Error', {
                positionClass: 'toast-top-right',
              });
            }
          })
        }
        else{
          this.candidate.candidateSkills.splice(index, 1);
        }

      })
      .catch((reason) => {});
  }

  addSkills(){
    this.candidate.candidateSkills.push(new CandidateSkill());
    // this.updateFormData();
  }

  updateFormData() {
    // this.candidate.socialMediaLinks.push(this.socialMediaLinks)
    if(this.website.url){
      this.candidate.socialMediaLinks.push(this.website)
    }
    if(this.facebook.url){
      this.candidate.socialMediaLinks.push(this.facebook)
    }
    if(this.github.url){
      this.candidate.socialMediaLinks.push(this.github)
    }
    if(this.instagram.url){
      this.candidate.socialMediaLinks.push(this.instagram)
    }
    if(this.twitter.url){
      this.candidate.socialMediaLinks.push(this.twitter)
    }
    if(this.linkedIn.url){
      this.candidate.socialMediaLinks.push(this.linkedIn)
    }

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
    const hasEmptySkillLevel = this.candidate.candidateSkills.some(skill => skill.skillLevel === undefined || skill.skillLevel === null);
    console.log(hasEmptySkillLevel);
    console.log(this.candidate.candidateSkills);
    
    if (hasEmptySkillLevel) {
      this.toastr.warning('You Should rate yourself for all the skills', '', {
        positionClass: 'toast-top-right',
      });
      
    } 
    else {
      this.router.navigate(['signup/profile-summary']);
    }
  }

  back(){
    this.router.navigate(['signup/education']);
  }


  formatLabel(value: number): string {
    return `${value}%`;
  }

  updateData(){
    this.loader = true;
    this.loaderMessage = "Please wait while we are saving the data"
    // this.updateSkills();
    this.updateSocialMedia();
    setTimeout(()=>{
      this.toastr.success('Skills Added Successfully', 'Success', {
        positionClass: 'toast-top-right',
      });
      this.updateFormData();

      // this.router.navigate(['profile']);
    },3000)
  }

  updateSkills(){

    let payload = this.candidate.candidateSkills;
    let candidateId = localStorage.getItem('userId')
    const filteredArray = payload.filter(obj => Object.keys(obj).length !== 0);
    const storedFormData = JSON.parse(localStorage.getItem('formData'));
    
    filteredArray.forEach((item, index, array) => {
      if (item.id) {
        const matchingData = storedFormData.candidateSkills.find((data) => data.id === item.id);
    
        if (!matchingData || !this.isEqual(matchingData, item)) {
          let id = item.id;
          let candidateId = item.candidateId;
          this.signupService.updateSkills(item, id, candidateId).subscribe({
            next: (res: any) => {
              console.log(res);
              
            },
            error: (err: any) => {
              console.log(err);
              this.toastr.error('Error While Updating Skills', 'Error', {
                positionClass: 'toast-top-right',
              });
            },
            // complete: () => {
            //   // Check if it's the last iteration and execute your function
            //   if (index === array.length - 1) {
            //     this.toastr.success('Skills Updated Successfully', 'Success', {
            //       positionClass: 'toast-top-right',
            //     });
            //     this.updateFormData();
            //     this.router.navigate(['profile']);
            //   }
            // },
          });
        }
      } else {
        item.candidateId = Number(candidateId);
        this.signupService.newSkills(item).subscribe({
          next: (res: any) => {
            console.log(res);
            
          },
          error: (err: any) => {
            console.log(err);
            this.toastr.error('Error While Adding Skills', 'Error', {
              positionClass: 'toast-top-right',
            });
          },
          // complete: () => {
          //   // Check if it's the last iteration and execute your function
          //   if (index === array.length - 1) {
          //     this.toastr.success('Skills Added Successfully', 'Success', {
          //       positionClass: 'toast-top-right',
          //     });
          //     this.updateFormData();
          //     this.router.navigate(['profile']);
          //   }
          // },
        });
      }
    });
    
    
  }

  updateSocialMedia(){
    console.log("socialMedia");
    
    let payload = this.candidate.socialMediaLinks;
    let candidateId = localStorage.getItem('userId')
    const filteredArray = payload.filter(obj => Object.keys(obj).length !== 0);
    const storedFormData = JSON.parse(localStorage.getItem('formData'));
    
    filteredArray.forEach((item, index, array) => {
      if (item.id) {
        const matchingData = storedFormData.socialMediaLinks.find((data) => data.id === item.id);
        
        if (!matchingData || !this.isEqual(matchingData, item)) {
          let id = item.id;
          let candidateId = item.candidateId;
          this.signupService.updateSocialMedia(item, id, candidateId).subscribe({
            next: (res: any) => {
              console.log(res);
              
            },
            error: (err: any) => {
              console.log(err);
              this.toastr.error('Error While Updating Social Media', 'Error', {
                positionClass: 'toast-top-right',
              });
            },
          });
        }
      } else {
        item.candidateId = Number(candidateId);
        this.signupService.newSocialMedia(item).subscribe({
          next: (res: any) => {
            console.log(res);
            
          },
          error: (err: any) => {
            console.log(err);
            this.toastr.error('Error While Adding Social Media', 'Error', {
              positionClass: 'toast-top-right',
            });
          },
        });
      }
    });
    
  }

  isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  cancel(){
    this.router.navigate(['profile']);
  }

}




