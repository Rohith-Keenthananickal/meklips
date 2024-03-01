import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormDataService } from '../../service/form-data.service';
import { DatePipe } from '@angular/common';
import { Candidate, EducationalDegree, WorkExperience } from '../../models/signup.models';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { SignupService } from '../../service/signup.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConformationComponent } from 'src/app/common/components/delete-conformation/delete-conformation.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
  public loader : boolean;
  private modalRef: NgbModalRef;
  public edit : boolean = false;
  
  constructor(
    private router: Router,
    private formDataService: FormDataService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute,
    private signupService: SignupService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getLocalData();
    console.log(this.candidate);
    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        console.log(params);
        this.editable = params['edit'];
        console.log(this.editable);
      }
    );
    
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getLocalData() {
    let localData = this.formDataService.getLocalData();
    this.candidate = localData;
    this.candidate.educationalDegrees = this.candidate.educationalDegrees || [];
  }

  saveToCard(){
    this.edit = false
    this.candidate.educationalDegrees.push(this.educationalDegrees)
    this.educationalDegrees = new EducationalDegree();
  }

  editData(index){
    this.edit = true
    let temp = this.candidate.educationalDegrees[index]
    let temp2 = JSON.parse(JSON.stringify(temp));
    this.candidate.educationalDegrees.splice(index,1)
    this.educationalDegrees = temp2;
  }

  // getDegree() {
  //   this.signupService.getDegree().subscribe({
  //     next: (res: any) => {
  //       console.log(res);
  //       this.university = res;
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //     },
  //   });
  // }

  deleteEducation(index : number, id : string){
    this.modalRef = this.modalService.open(DeleteConformationComponent, {
      size: 'sm',
    });
    this.modalRef.componentInstance.warningSubject = `You want to Delete this Education Details`;
    this.modalRef.result
      .then((result) => {
        console.log(result);
        if(id){
          this.signupService.deleteEducation(id).subscribe({
            next:(res:any)=>{
              console.log(res);
              this.candidate.educationalDegrees.splice(index, 1);
              this.toastr.success('Education Details Deleted', 'Success', {
                positionClass: 'toast-top-right',
              });
            },
            error:(err:any)=>{
              console.log(err);
              this.toastr.error('Failed to Delete Education Details ', 'Error', {
                positionClass: 'toast-top-right',
              });
            }
          })
        }
        else{
          this.candidate.educationalDegrees.splice(index, 1);
        }

      })
      .catch((reason) => {});
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

  // updateEducation() {
  //   this.updateFormData();
  //   let payload = this.candidate.educationalDegrees;
  //   let candidateId = localStorage.getItem('userId');
  //   const filteredArray = payload.filter(
  //     (obj) => Object.keys(obj).length !== 0
  //   );
  //   console.log(filteredArray);

  //   filteredArray.forEach((item) => {
  //     if (item.id) {
  //       let id = item.id;
  //       let candidateId = item.candidateId;
  //       this.signupService.updateEducation(item, id, candidateId).subscribe({
  //         next: (res: any) => {
  //           console.log(res);
  //         },
  //         error: (err: any) => {
  //           console.log(err);
  //         },
  //       });
  //     } else {
  //       item.candidateId = Number(candidateId);
  //       this.signupService.AddEducation(item).subscribe({
  //         next: (res: any) => {
  //           console.log(res);
  //         },
  //         error: (err: any) => {
  //           console.log(err);
  //         },
  //       });
  //     }
  //   });
  //   setTimeout(() => {
  //     this.router.navigate(['profile']);
  //   }, 1000);
  // }

  updateEducation(){
    this.loader = true;
    let payload = this.candidate.educationalDegrees;
    let candidateId = localStorage.getItem('userId')
    const filteredArray = payload.filter(obj => Object.keys(obj).length !== 0);
    const storedFormData = JSON.parse(localStorage.getItem('formData'));
    
    filteredArray.forEach((item) => {
      if (item.id) {
        const matchingData = storedFormData.educationalDegrees.find((data) => data.id === item.id);
  
        if (!matchingData || !this.isEqual(matchingData, item)) {
          let id = item.id;
          let candidateId = item.candidateId;
          this.signupService.updateEducation(item, id, candidateId).subscribe({
            next: (res: any) => {
              console.log(res);
             this.loader = false;

            },
            error: (err: any) => {
              console.log(err);
              this.loader = false;

            },
          });
        }
      } else {
        item.candidateId = Number(candidateId);
        this.signupService.AddEducation(item).subscribe({
          next: (res: any) => {
            console.log(res);
            this.loader = false;

          },
          error: (err: any) => {
            console.log(err);
            this.loader = false;

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

