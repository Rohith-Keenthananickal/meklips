import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SignupService } from '../../service/signup.service';
import { Candidate, CandidateSummaryPayload } from '../../models/signup.models';
import { FormDataService } from '../../service/form-data.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/modules/home-profile/service/profile.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
  public videoLoader : boolean
  public isDataSaved : boolean = false;
  public loaderMessage = '';
  subscription:Subscription;
  public editable : string
  public imageUrl
  image: string;
  video: string;
  videoUrl: SafeUrl;
  public summaryPayload = new CandidateSummaryPayload ()

  constructor(private router: Router,
    private signupService : SignupService,
    private formDataService: FormDataService,
    private toastr: ToastrService,
    private activeRoute:ActivatedRoute,
    private profileService : ProfileService,
    private sanitizer:DomSanitizer
    ) {}

  ngOnInit(): void {
    this.getLocalData();
    console.log(this.loader);
    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        console.log('Query Params:', params);
        this.editable = params['edit'];
        console.log('Editable:', this.editable);
        console.log(typeof(this.editable));
        
      if(this.editable == "true"){
        this.getUserImage();
        this.getUSerVideo();
      }
        
    });
   
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
  }

  profileView(){
    this.router.navigate(['profile']);
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

  onRemoveImage(event: any) {
    console.log(event);
    this.imageFile.splice(this.imageFile.indexOf(event), 1);
  }

  onRemoveVideo(event: any) {
    console.log(event);
    this.videoFile.splice(this.videoFile.indexOf(event), 1);
  }


  uploadImage(){
    this.loader = true
    let candidateId= localStorage.getItem('userId');
    let fileName = this.getImage?.addedFiles[0]?.name;
    let video = this.getImage?.addedFiles[0];
    if(this.getImage?.addedFiles?.length > 0){
      const form = new FormData();
      form.append('FileContent', video);
      this.signupService.uploadDp(form,candidateId,fileName).subscribe({
        next:(res : any)=>{
          console.log(res);
          this.loader = false
        },
        error:(err : any)=>{
          console.log(err);
          this.loader = false
        }
      });
    } 
   
  }

  uploadVideo(){
    
    let candidateId= localStorage.getItem('userId');
    let fileName = this.getVideo?.addedFiles[0]?.name;
    let video = this.getVideo?.addedFiles[0];
    if(this.getVideo?.addedFiles.length > 0){
      this.videoLoader = true
      this.loaderMessage = 'Video is Processing, Please Wait'
      const form = new FormData();
      form.append('FileContent', video);
      this.signupService.uploadVideo(form,candidateId,fileName).subscribe({
        next:(res : any)=>{
          console.log(res);
          this.videoLoader = false   
        },
        error:(err : any)=>{
          console.log(err);
          this.videoLoader = false
          this.toastr.error('Failed to Save Video', 'Error', {
            positionClass: 'toast-top-right',
          });
          
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
        this.toastr.success('Candidate Profile Saved Successfully', 'Success', {
          positionClass: 'toast-top-right',
        });
        localStorage.setItem('userId',res.id);
        this.uploadImage();
        this.uploadVideo();
        this.loader = false
        this.isDataSaved = true;
      },
      error:(err:any)=>{
        console.log(err);
        this.loader = false
        this.toastr.error('Failed To Save Data', 'Error', {
          positionClass: 'toast-top-right',
        });
      }
    })
  }

  back(){
    console.log("bacvk");
    this.router.navigate(['signup/skills']);
  }

  cancel(){
    this.router.navigate(['profile']);
  }

  updateSummary(){
    this.summaryPayload.candidateId = Number(this.candidate.id)
    this.summaryPayload.experienceSummary = this.candidate.experienceSummary
    this.signupService.updateCandidateSummary(this.summaryPayload, this.candidate.id).subscribe({
      next:(res:any)=>{
        console.log(res);
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  getUserImage() {
    if (this.candidate.dpId !== 0) {
      this.profileService.getImage(this.candidate.dpId).subscribe({
        next: (res: any) => {
          console.log(res);
          this.image = URL.createObjectURL(res);
          console.log(this.image);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.image as string);

          // Create a File object with the provided data
          const mockFile = new File([res], 'profile-picture.jpg', { type: 'image/jpeg' });

          // Add the mock file to the imageFile array
          this.imageFile.push(mockFile);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  getUSerVideo() {
    if(this.candidate?.videoId && this.candidate?.videoId !== 0){
      this.profileService.getVideo(this.candidate?.videoId).subscribe({
        next: (res: any) => {
          console.log(res);
          this.video = URL.createObjectURL(res);
          console.log(this.video);
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.video as string);

          // Create a File object with the provided data
          const mockVideoFile = new File([], 'profile-video.mp4', { type: 'video/mp4' });

          // Add the mock video file to the videoFile array
          this.videoFile.push(mockVideoFile);
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
    
  }

  async updateProfile() {
    try {
      this.loader = true;
      this.updateSummary();
      await this.uploadImage();
      await this.uploadVideo();
  
      // Assuming uploadImage and uploadVideo return promises, handle the completion here
  
      this.loader = false;
      this.router.navigate(['profile']);
    } catch (error) {
      console.error('An error occurred during profile update:', error);
      this.loader = false;
      // Handle error or display a message to the user
    }
  }


}
