import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../../service/signup.service';
import { Candidate } from '../../models/signup.models';
import { FormDataService } from '../../service/form-data.service';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit {
  public candidate = new Candidate();
  public candidatePayload : Candidate;
  public imageFile: File[] = [];
  public videoFile: File[] = [];
  public getImage
  public getVideo
  public loader : boolean;

  constructor(private router: Router,
    private signupService : SignupService,
    private formDataService: FormDataService,
    ) {}

  ngOnInit(): void {
    this.getLocalData();

  }

  getLocalData(){
    let localData = this.formDataService.getLocalData();
    this.candidate = localData
  }

  updateFormData() {
    this.formDataService.updateFormData(this.candidate);
    // this.advancedView();
  }

  advancedView() {
    this.updateFormData();
    this.bulkSubmit();
    setTimeout(()=>{
      localStorage.clear();
      this.router.navigate(['profile']);
    },4000)
    
  }

  imageSelect(event: any) {
    this.getImage = event;
    console.log(this.getImage);
    this.imageFile.push(...event.addedFiles);
    console.log(this.imageFile);
  }

  videoSelect(event: any) {
    console.log(event);
    this.getVideo = event
    this.videoFile.push(...event.addedFiles);
  }

  onRemove(event: any) {
    console.log(event);
    // this.files.splice(this.files.indexOf(event), 1);
  }


  uploadImage(){
    let candidateId= localStorage.getItem('userId');
    let fileName = this.getImage?.addedFiles[0]?.name;
    let video = this.getImage?.addedFiles[0];
    if(this.getImage?.addedFiles?.length > 0){
      const form = new FormData();
      form.append('FileContent', video);
      this.signupService.uploadDp(form,candidateId,fileName).subscribe({
        next:(res : any)=>{
          console.log(res);
          
        },
        error:(err : any)=>{
          console.log(err);
          
        }
      });
    } 
   
  }

  uploadVideo(){
    let candidateId= localStorage.getItem('userId');
    let fileName = this.getVideo?.addedFiles[0]?.name;
    let video = this.getVideo?.addedFiles[0];
    if(this.getImage?.addedFiles.length > 0){
      const form = new FormData();
      form.append('FileContent', video);
      this.signupService.uploadVideo(form,candidateId,fileName).subscribe({
        next:(res : any)=>{
          console.log(res);
          
        },
        error:(err : any)=>{
          console.log(err);
          
        }
      })
    }
    
  }


  processData(): any {
    let localDataString = localStorage.getItem('formData');

    if (localDataString) {
      let localData = JSON.parse(localDataString);

      Object.keys(localData).forEach((key) => {
        if (Array.isArray(localData[key])) {
          localData[key] = localData[key].filter(
            (obj) => Object.keys(obj).length !== 0
          );
        }
      });

      // const candidateId = localStorage.getItem('userId');

      // Object.keys(localData).forEach((key) => {
      //   if (Array.isArray(localData[key])) {
      //     localData[key].forEach((obj) => (obj.candidateId = candidateId));
      //   }
      // });

      return localData;
    } else {
      console.error('No formData found in localStorage.');
      return null; // or handle accordingly based on your requirements
    }
  }

  bulkSubmit(){
    this.loader = true
    this.candidatePayload = this.processData();
    this.signupService.candidateBulk(this.candidatePayload).subscribe({
      next:(res:any)=>{
        console.log(res);
        localStorage.setItem('userId',res.id);
        this.uploadImage();
        this.uploadVideo();
        this.loader = false
      },
      error:(err:any)=>{
        console.log(err);
        this.loader = false
      }
    })
  }
}
