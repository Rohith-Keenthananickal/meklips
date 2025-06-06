import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';
import { FormDataService } from '../../service/form-data.service';
import { Candidate, CurrentAddress } from '../../models/signup.models';
import { SignupService } from '../../service/signup.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit{
  @ViewChild('picker') datepicker!: MatDatepicker<Date>;
  public candidate = new Candidate();
  public currentAddress = new CurrentAddress();
  public formData = {}
  subscription:Subscription;
  public editable : boolean
  public loader : boolean;
  public currentDate : Date = new Date();

  constructor(private router:Router,
    private formDataService: FormDataService,
    private signupService : SignupService,
    private datePipe: DatePipe,
    private activeRoute:ActivatedRoute,
    private toastr: ToastrService){

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
    let email = localStorage.getItem('meklips.email');
    this.candidate.email = email;
    this.candidate.currentAddress=this.currentAddress;
  
  }

  validate():boolean{
    return !!(this.candidate.firstName && this.candidate.lastName && this.candidate.email && this.candidate.dob)
  }

  goToNextPage(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit:true,
      }
    }
    this.router.navigate(['signup/highlights'],navigationExtras)
  }

  openDatepicker() {
    this.datepicker.open();
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
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    
    // Allow control keys and digits only
    if (!allowedKeys.includes(event.key) && (isNaN(Number(event.key)) || event.key === ' ')) {
      event.preventDefault();
    }
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
    this.router.navigate(['signup/highlights'])
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
    
    this.loader = true
    console.log(this.candidate);
    let id = localStorage.getItem('meklips.userId')
    let payload = this.candidate
    delete payload.dpId;
    delete payload.videoId;
    delete payload.educationalDegrees;
    delete payload.candidateSkills;
    delete payload.workExperiences;
    delete payload.socialMediaLinks;
     let checkAddress = Object.keys(payload.currentAddress)
     if(checkAddress.length === 0){
      delete payload.currentAddress
     }
     else{
      payload.currentAddress.candidateId = Number(id);
     }
    this.signupService.updateCandidate(payload,id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.loader = false
        this.toastr.success('Personal Details Updated', 'Success', {
          positionClass: 'toast-top-right',
        });
        this.router.navigate(['profile']);
      },
      error:(err : any)=>{
        console.log(err);
        this.loader = false
        this.toastr.error('Personal Details Update Error ', 'Error', {
          positionClass: 'toast-top-right',
        });
      }
    })
  }

  cancel(){
    this.router.navigate(['profile']);
  }

  private notNullAndUndefined(value: any): boolean {
    return value !== null && value !== undefined;
  }
}
