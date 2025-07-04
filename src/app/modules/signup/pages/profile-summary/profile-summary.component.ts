import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SignupService } from '../../service/signup.service';
import { Candidate, CandidateSummaryPayload } from '../../models/signup.models';
import { FormDataService } from '../../service/form-data.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/modules/home-profile/service/profile.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environment/environment';

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
  videoUrl: string;
  public summaryPayload = new CandidateSummaryPayload ()

  constructor(private router: Router,
    private signupService : SignupService,
    private formDataService: FormDataService,
    private toastr: ToastrService,
    private activeRoute:ActivatedRoute,
    private profileService : ProfileService,
    private location: Location,
    ) {}

  ngOnInit(): void {
    this.getLocalData();
    console.log(this.loader);
    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        this.editable = params['edit'];
        console.log('testing this version works');
        
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

  advancedView(){
    this.updateFormData();
    if(this.imageFile.length == 0){
      this.toastr.error('Please Add Your Profile Picture', 'Error', {
        positionClass: 'toast-top-right',
      });
    }
    else{
      this.bulkSubmit(); 
    }
  }

  profileView(){
    // Navigate to profile and prevent going back to this page
    this.navigateToProfileAndPreventBack();
  }

  /**
   * Helper method to navigate to profile page and prevent going back to this page
   */
  private navigateToProfileAndPreventBack() {
    // First, replace the current URL in history with the profile page
    this.location.replaceState('/profile');
    
    // Then navigate to ensure the route is properly loaded
    this.router.navigate(['/profile'], { replaceUrl: true });
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


  uploadImage(id : any) {
    this.loader = true;
    let candidateId = this.candidate.id ? this.candidate.id : id;
  
    if (this.getImage?.addedFiles?.length > 0) {
      let originalFile = this.getImage.addedFiles[0];
      let originalName = originalFile.name;
  
      // Extract file extension
      let fileExtension = originalName.substring(originalName.lastIndexOf('.'));
      
      // Generate random string or number
      let uniqueSuffix = Date.now() + '-' + Math.floor(Math.random() * 10000);
  
      // Create new file name with unique suffix
      let newFileName = originalName.replace(fileExtension, '') + '-' + uniqueSuffix + fileExtension;
  
      // Create a new File object with the new name
      const newFile = new File([originalFile], newFileName, { type: originalFile.type });
  
      const form = new FormData();
      form.append('image', newFile);
      console.log(form);
      
      this.signupService.uploadDp(form, candidateId, newFileName).subscribe({
        next: (res: any) => {
          console.log(res);
          this.loader = false;
          if(this.getVideo?.addedFiles.length > 0){
            this.uploadVideo(candidateId);
          }
          else{
            setTimeout(()=>{
              this.loader = false;
              this.navigateToProfileAndPreventBack();
            },1000)
          }
        },
        error: (err: any) => {
          console.log(err);
          this.loader = false;
        }
      });
    }
  }
  

  uploadVideo(id : any){
    
    let candidateId= this.candidate.id ? this.candidate.id : id;
    let fileName = this.getVideo?.addedFiles[0]?.name;
    let video = this.getVideo?.addedFiles[0];
    if(this.getVideo?.addedFiles.length > 0){
      this.videoLoader = true
      this.loaderMessage = 'Video is Processing, Please Wait'
      const form = new FormData();
      form.append('video', video);
      this.signupService.uploadVideo(form,candidateId,fileName).subscribe({
        next:(res : any)=>{
          console.log(res);
          this.videoLoader = false;
          setTimeout(()=>{
            this.loader = false;
            this.navigateToProfileAndPreventBack();
          },1000)  
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
    delete this.candidatePayload.currentAddress;
    this.candidatePayload.userId = localStorage.getItem('meklips.userId');
    this.signupService.candidateBulk(this.candidatePayload).subscribe({
      next:(res:any)=>{
        this.uploadImage(res.data.id);
        this.toastr.success('Candidate Profile Saved Successfully', 'Success', {
          positionClass: 'toast-top-right',
        });
        localStorage.setItem('candidateId',res.data.id);

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
    this.router.navigate(['signup/highlights']);
  }

  cancel(){
    this.navigateToProfileAndPreventBack();
  }

  updateSummary(){
    let id = localStorage.getItem('meklips.userId')
    this.signupService.updateCandidate(this.candidate,id).subscribe({
      next:(res:any)=>{
        console.log(res);
        if(this.getImage?.addedFiles?.length > 0){
          this.uploadImage(this.candidate.id);
        }
        else if(this.getVideo?.addedFiles?.length > 0){
          this.uploadVideo(this.candidate.id);
        }
        else{
          setTimeout(()=>{
            this.loader = false;
            this.navigateToProfileAndPreventBack();
          },1000)
        }
        
      },
      error:(err:any)=>{
        console.log(err);
        
      }
    })
  }

  getUserImage() {
    if(this.candidate.dpId){
      this.imageUrl = (environment.url+'media/user_images/' + this.candidate?.dpId);
      this.fetchImageAsFile(this.imageUrl,this.candidate.dpId)
    }
   
  }

  fetchImageAsFile(url: string, filename: string) {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], filename, { type: blob.type });
        console.log(file);
        
        this.imageFile.push(file);
        console.log(this.imageFile);
        
      })
      .catch(err => console.error('Image prefill failed:', err));
  }

  fetchVideoAsFile(url: string, filename: string) {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], filename, { type: blob.type });
        this.videoFile.push(file);
        
      })
      .catch(err => console.error('Image prefill failed:', err));
  }

  getUSerVideo() {
    if(this.candidate?.videoId && this.candidate?.videoId !== 0){
      this.videoUrl = (environment.url+'media/profile_videos/' + this.candidate?.videoId);
      this.fetchVideoAsFile(this.videoUrl,this.candidate.dpId)
    }
    
  }

  async updateProfile() {
    try {
      this.loader = true;
      this.updateSummary();
     
     
    } catch (error) {
      console.error('An error occurred during profile update:', error);
      this.loader = false;
      // Handle error or display a message to the user
    }
  }

}
