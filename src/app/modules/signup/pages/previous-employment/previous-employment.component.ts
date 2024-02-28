import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormDataService } from '../../service/form-data.service';
import { Candidate, WorkExperience } from '../../models/signup.models';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { SignupService } from '../../service/signup.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConformationComponent } from 'src/app/common/components/delete-conformation/delete-conformation.component';

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
  public loader : boolean
  private modalRef: NgbModalRef;

  constructor(private router:Router,
    private formDataService: FormDataService,
    private datePipe: DatePipe,
    private activeRoute:ActivatedRoute,
    private signupService : SignupService,
    private toastr: ToastrService,
    private modalService: NgbModal){

  }
  ngOnInit(): void {
    this.getLocalData();
    console.log(this.candidate);
    if(this.candidate.workExperiences.length == 0){
      // Object.keys(this.candidate.workExperiences).length > 0
      console.log("0");
      
      this.candidate.workExperiences.push(this.workExperiences)
    }
   
    
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
  deleteEmployment(index : number){
    this.modalRef = this.modalService.open(DeleteConformationComponent, {
      size: 'sm',
    });
    this.modalRef.componentInstance.warningSubject = `You want to Delete this Employment Details`;
    this.modalRef.result
      .then((result) => {
        console.log(result);
        this.candidate.workExperiences.splice(index, 1);
        
      })
      .catch((reason) => {});
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
    this.loader = true
    let payload = this.candidate.workExperiences;
    let candidateId = localStorage.getItem('userId')
    const filteredArray = payload.filter(obj => Object.keys(obj).length !== 0);
    const storedFormData = JSON.parse(localStorage.getItem('formData'));
    
    filteredArray.forEach((item) => {
      if (item.id) {
        const matchingData = storedFormData.workExperiences.find((data) => data.id === item.id);
  
        if (!matchingData || !this.isEqual(matchingData, item)) {
          let id = item.id;
          let candidateId = item.candidateId;
          this.signupService.updateWorkExperiance(item, id, candidateId).subscribe({
            next: (res: any) => {
              console.log(res);
              this.loader = false

              this.toastr.success('Work Experiance Updated Successfully', 'Success', {
                positionClass: 'toast-top-right',
              });
            },
            error: (err: any) => {
              console.log(err);
              this.loader = false
              this.toastr.error('Error while Updating Work Experiance ', 'Error', {
                positionClass: 'toast-top-right',
              });
            },
          });
        }
      } else {
        item.candidateId = Number(candidateId);
        this.signupService.AddWorkExperiance(item).subscribe({
          next: (res: any) => {
            console.log(res);
            this.loader = false

            this.toastr.success('Work Experiance Added Successfully', 'Success', {
              positionClass: 'toast-top-right',
            });
          },
          error: (err: any) => {
            console.log(err);
            this.loader = false
            this.toastr.error('Error while Adding Work Experiance ', 'Error', {
              positionClass: 'toast-top-right',
            });
          },
        });
      }
    });
    setTimeout(()=>{
      this.updateFormData();
      this.router.navigate(['profile']);
    },1000)
    
  }

  isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  cancel(){
    this.router.navigate(['profile']);
  }
}
