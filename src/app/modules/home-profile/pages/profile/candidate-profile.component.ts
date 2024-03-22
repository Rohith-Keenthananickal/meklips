import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common-services/auth.service';
import { ProfileService } from '../../service/profile.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';
import { Candidate } from '../../../signup/models/signup.models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit{
  public auth: boolean;
  public nAuth: boolean;
  public candidate : Candidate;
  public image
  public displayedFileURL: any;
  public loader : boolean;
  public imageSrc: string | ArrayBuffer;
  public imageToShow: string | ArrayBuffer;
  public imageUrl
  public video: string;
  public videoUrl: SafeUrl;
  public url : string
  public candidateId 
  subscription:Subscription;


  constructor(private authService: AuthService,
    private profileService : ProfileService,
    private toastr: ToastrService,
    private router:Router,
    private activeRoute:ActivatedRoute,
    private location: Location,
    private sanitizer:DomSanitizer){

  }
  ngOnInit(): void {
    this.subscription = this.activeRoute.paramMap.subscribe(
      (params: ParamMap) => {
        this.candidateId = params.get('id');
        
      });
    // this.auth = this.authService.isAuthenticated();
    // console.log(this.authService.isAuthenticated());
    this.getUser();
    this.url = window.location.origin + window.location.pathname;
    console.log('Full URL with protocol:', this.url);
  }

 
  formatLabel(value: number): string {
    return `${value}%`;
  }

  /* Set the width of the side navigation to 250px */
 openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
 closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
  
  getUser() {
    this.loader = true
    this.profileService.getCandidateById(this.candidateId).subscribe({
      next:(res : any)=>{
        console.log(res);
        this.candidate = res;
        this.candidate.candidateSkills = this.candidate.candidateSkills.slice().sort((a, b) => b.skillLevel - a.skillLevel);
        this.getImage();
        localStorage.setItem('formData',JSON.stringify(this.candidate));
        localStorage.setItem('userId',res.id)
        localStorage.setItem('CandidateId',String(this.candidate?.currentAddress?.candidateId))
        this.loader = false
        this.getVideo();
        
      },
      error:(err : HttpErrorResponse)=>{
        console.log(err);
        this.loader = false
        if(err.status == 404){
          this.toastr.error('Please Complete Your Profile', 'Error', {
            positionClass: 'toast-top-right',
          });
          this.router.navigate(['signup/personal-details']);
        }
        if(err.status == 400){
          this.toastr.error('Please Complete Your Profile', 'Error', {
            positionClass: 'toast-top-right',
          });
          this.router.navigate(['signup/personal-details']);
        }
        
      }
    });
  }

  formatData(remark: string): string {
    if (remark) {
      return remark.replace(/\n/g, '<br>');
    }
    return '';
  }

  goToVideo(){
    this.router.navigate(['profile/' + this.candidateId + '/video']);

  }

  logout(){
    this.authService.logout();
    this.router.navigate(['login']);
  }



  getImage(){
    if(this.candidate.dpId !==0){
      this.profileService.getImage(this.candidate.dpId).subscribe({
        next:(res :any)=>{
          console.log(res);
          this.image = URL.createObjectURL(res)
          console.log(this.image);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.image as string);
          // return this.sanitizer.bypassSecurityTrustUrl(this.image as string);
          // this.createImageFromBlob(res);
          // this.convertBlobToDataUrl(res);
          // this.image = res
          
        },
        error:(err: any)=>{
          console.log(err);
          
        }
      })
    }

  }

  getVideo() {
    if(this.candidate?.videoId && this.candidate?.videoId !== 0){
      this.profileService.getVideo(this.candidate?.videoId).subscribe({
        next: (res: any) => {
          console.log(res);
          this.video = URL.createObjectURL(res);
          console.log(this.video);
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.video as string);
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    }
    
  }
  

calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  // If the birthday hasn't occurred yet this year, subtract one year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

  personalDetails(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit:true,
      }
    }
    this.router.navigate(['signup/personal-details'],navigationExtras)
  }
  
  getProgressBarWidth(value: number): number {
    return value; // Adjust this based on how you want the width to be calculated
  }

  getBackgroundColor(skillLevel: number): string {
    if (skillLevel > 8) {
      return '#90d400';
    } else if (skillLevel == 7 || skillLevel == 8) {
      return '#bbd711';
    } else if (skillLevel == 5 || skillLevel == 6) {
      return '#feba28';
    } else if (skillLevel == 3 || skillLevel == 4) {
      return '#fe5c25';
    } else if (skillLevel == 1 || skillLevel == 2) {
      return '#fa001c';
    } else {
      return ''; // Handle other cases as needed
    }
  }
}
