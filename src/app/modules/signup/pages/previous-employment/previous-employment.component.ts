import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';
import { FormDataService } from '../../service/form-data.service';
import { Candidate, WorkExperience } from '../../models/signup.models';
import {MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
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
  @ViewChild('picker') datepicker!: MatDatepicker<Date>;
  @ViewChild('picker2') datepicker2!: MatDatepicker<Date>;

  public candidate = new Candidate();
  public workExperiences : WorkExperience = new WorkExperience()
  public formData = {}
  subscription:Subscription;
  public editable : boolean
  public loader : boolean
  private modalRef: NgbModalRef;
  public edit : boolean = false;
  public currentDate : Date = new Date();

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

    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        console.log(params);
        this.editable = params['edit'];
        console.log(this.editable);
        
      });
  }

  goToNextPage(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit:true,
      }
    }
    this.router.navigate(['signup/highlights'],navigationExtras)
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openDatepicker() {
    this.datepicker.open();
  }

  openDatepicker2() {
    this.datepicker2.open();
  }

  saveToCard(){
    if(this.workExperiences.designation !== undefined){
      this.edit = false
      this.candidate.workExperiences.push(this.workExperiences)
      this.workExperiences = new WorkExperience();
    }
   
  }

  editData(index){
    this.saveToCard();
    this.edit = true
    let temp = this.candidate.workExperiences[index]
    let temp2 = JSON.parse(JSON.stringify(temp));
    this.candidate.workExperiences.splice(index,1)
    this.workExperiences = temp2;
  }
  
  getLocalData(){
    let localData = this.formDataService.getLocalData();
    this.candidate = localData
    this.candidate.workExperiences = this.candidate.workExperiences || [];
  }


  deleteEmployment(index : number, id:string){
    this.modalRef = this.modalService.open(DeleteConformationComponent, {
      size: 'sm',
    });
    this.modalRef.componentInstance.warningSubject = `You want to Delete this Employment Details`;
    this.modalRef.result
      .then((result) => {
        console.log(result);
        if(id){
          this.signupService.deleteWorkExperiance(id).subscribe({
            next:(res:any)=>{
              console.log(res);
              this.candidate.workExperiences.splice(index, 1);
              this.updateFormData();
              this.toastr.success('Work Experience Deleted', 'Success', {
                positionClass: 'toast-top-right',
              });
            },
            error:(err:any)=>{
              console.log(err);
              this.toastr.error('Failed to Delete Work Experience ', 'Error', {
                positionClass: 'toast-top-right',
              });
            }
          })
        }
        else{
          this.candidate.workExperiences.splice(index, 1);
          this.updateFormData();
        }
      })
      .catch((reason) => {});
  }

  deleteEmploymentLocally(index){
    this.modalRef = this.modalService.open(DeleteConformationComponent, {
      size: 'sm',
    });
    this.modalRef.componentInstance.warningSubject = `You want to Delete this Employment Details`;
    this.modalRef.result.then((result) => {
      console.log(result);
      this.candidate.workExperiences.splice(index,1)
    })
    
  }


  addWorkExperience(): void {
    let newExperence = new WorkExperience()
    this.candidate.workExperiences.push(newExperence);

  }

  updateFormData() {
    console.log(this.candidate);
    this.formDataService.updateFormData(this.candidate);

  }

  formatDate(selectedDate: any): string {
    // Convert the date to a JavaScript Date object
    const jsDate = new Date(selectedDate);

    // Use DatePipe to format the date
    const formattedDate = this.datePipe.transform(jsDate, 'yyyy-MM-dd');

    return formattedDate || '';
  }

  checkForCurrentEmployment() : boolean{
    return this.candidate.workExperiences.some((experience)=>{
      experience.currentJob == true;
    })    
  }


  startDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(this.formatDate(event.value));
    this.workExperiences.startDate = this.formatDate(this.workExperiences.startDate) 
  }

  endDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    this.workExperiences.endDate = this.formatDate(this.workExperiences.endDate) 

  }

  advancedView(){
    // this.addWorkExperience();
    this.saveToCard();
    this.updateFormData();
    this.router.navigate(['signup/highlights']);
  }

  back(){
    this.router.navigate(['signup/personal-details']);
  }


  updateWorkExperiance(){
    this.saveToCard();
    this.loader = true
    let id = localStorage.getItem('meklips.userId')
    let payload = new Candidate();
    let workExperiences : WorkExperience[];
    workExperiences = this.candidate.workExperiences
    payload.workExperiences = workExperiences
    this.signupService.updateCandidate(payload,id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.loader = false
        this.toastr.success('Highlights Updated', 'Success', {
          positionClass: 'toast-top-right',
        });
        // this.router.navigate(['profile']);
        setTimeout(()=>{
          this.updateFormData();
          this.router.navigate(['profile']);
        },1000)
      },
      error:(err : any)=>{
        console.log(err);
        this.loader = false
        this.toastr.error('Error While Updating Highlights', 'Error', {
          positionClass: 'toast-top-right',
        });
      }
    
    }

   
    
  )}

  isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  cancel(){
    this.router.navigate(['profile']);
  }
}
