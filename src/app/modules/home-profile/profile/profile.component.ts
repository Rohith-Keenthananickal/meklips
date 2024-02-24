import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common-services/auth.service';
import { ProfileService } from '../service/profile.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { Candidate } from '../../signup/models/signup.models';
import { Login } from '../../login/models/login.models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public auth: boolean;
  public nAuth: boolean;
  public candidate : Candidate;
  public image
  displayedFileURL: any;
  public loader : boolean;
  imageSrc: string | ArrayBuffer;

  constructor(private authService: AuthService,
    private profileService : ProfileService,
    private toastr: ToastrService,
    private router:Router,
    private sanitizer: DomSanitizer,){

  }
  ngOnInit(): void {
    this.auth = this.authService.isAuthenticated();
    console.log(this.authService.isAuthenticated());
    this.getUser();
    
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
    this.profileService.getUserData().subscribe({
      next:(res : any)=>{
        console.log(res);
        this.candidate = res;
        localStorage.setItem('formData',JSON.stringify(this.candidate));
        localStorage.setItem('userId',res.id)
        localStorage.setItem('CandidateId',String(this.candidate?.currentAddress?.candidateId))
        console.log(this.candidate.workExperiences);
        this.loader = false
        this.getImage();
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
        
      }
    })
  }

  convertBlobToDataUrl(blob: Blob): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.imageSrc = reader.result;
    };
    reader.readAsDataURL(blob);
    console.log(this.imageSrc);
    
  }



  logout(){
    this.authService.logout();
    this.router.navigate(['login']);
  }

  getRandomClass(): string {
    const classes = ['#f6f8fb', '#f6f8fb', '#f6f8fb', '#f6f8fb'];
    const randomIndex = Math.floor(Math.random() * classes.length);
    return classes[randomIndex];
  }

  getImage(){
    if(this.candidate.dpId !==0){
      this.profileService.getImage(this.candidate.dpId).subscribe({
        next:(res :any)=>{
          console.log(res);
          this.convertBlobToDataUrl(res);
          this.image = res
          
        },
        error:(err: any)=>{
          console.log(err);
          
        }
      })
    }

  }

  getVideo(){
    this.profileService.getVideo(this.candidate.videoId).subscribe({
      next:(res :any)=>{
        
        console.log(res);
        // this.image = res
        
      },
      error:(err: any)=>{
        console.log(err);
        
      }
    })
  }

  personalDetails(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit:true,
      }
    }
    this.router.navigate(['signup/personal-details'],navigationExtras)
  }

  updateSkills(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit:true,
      }
    }
    this.router.navigate(['signup/skills'],navigationExtras)
  }

  updateExperiance(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit:true,
      }
    }
    this.router.navigate(['signup/previous-employment'],navigationExtras)
  }

  updateEducation(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit:true,
      }
    }
    this.router.navigate(['signup/education'],navigationExtras)
  }
}
