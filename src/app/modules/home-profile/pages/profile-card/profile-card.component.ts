import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common-services/auth.service';
import { ProfileService } from '../../service/profile.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Candidate } from 'src/app/modules/signup/models/signup.models';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VideoPlayerModalComponent } from '../../components/video-player-modal/video-player-modal.component';
import { QrCodeModalComponent } from '../../components/qr-code-modal/qr-code-modal.component';
@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  public candidateId : number;
  public candidate : Candidate;
  public loading : boolean;
  public selectedHighlight : number = 0;
  public imageUrl: string;
  public imageLoading: boolean = true;
  public pageFullyLoaded: boolean = false;
  private modalRef: NgbModalRef;
  private modalRef2: NgbModalRef;
  public mailId : string;
  public hasParams : boolean = false;
  public uuid : string;
  public isLiked : boolean = false;
  
  constructor(private authService: AuthService,
    private profileService : ProfileService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal){

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['uuid']) {
        this.hasParams = true;
        this.uuid = params['uuid'];
        localStorage.removeItem('formData');
        console.log(this.hasParams);
        this.getCandidateByUuid();
      } else {
        this.hasParams = false;
        this.candidateId = Number(localStorage.getItem('meklips.userId'));
        this.getCandidateInfo();
      }

    });
    this.isLiked = localStorage.getItem('meklips.isLiked') == 'true';
    this.mailId = localStorage.getItem('meklips.email');
  }

  getCandidateByUuid(){
    this.profileService.getCandidateByUuid(this.uuid).subscribe({
      next:(res : any)=>{
        console.log(res);
        this.candidate = res.data;
        this.candidate.candidateSkills = this.candidate.candidateSkills.slice().sort((a, b) => b.skillLevel - a.skillLevel);
        // this.getImage();
        localStorage.setItem('formData',JSON.stringify(this.candidate));
        // localStorage.setItem('userId',res.id)
        localStorage.setItem('CandidateId',String(this.candidate?.currentAddress?.candidateId))
        this.mailId = this.candidate?.user?.email;
        this.imageUrl = (environment.url+'media/user_images/' + this.candidate?.dpId);
        this.imageLoading = true;
        this.loading = false;
        this.checkPageFullyLoaded();
      },
      error:(err : HttpErrorResponse)=>{
        console.log(err);
        if(err.status == 404){
          this.router.navigate(['/profile/not-found'], { queryParams: { uuid: this.uuid } });
        }
      }
    })
  }

  checkIsLiked() : boolean{
    return localStorage.getItem('meklips.isLiked') == 'true';
  }

  likeCandidate(){
    if(this.hasParams && !this.checkIsLiked()){
      this.candidate.likes = this.candidate.likes + 1;
      localStorage.setItem('meklips.isLiked', 'true');
      this.profileService.likeCandidate(Number(this.candidate.id)).subscribe({
        next:(res : any)=>{
        },
        error:(err : HttpErrorResponse)=>{
          console.log(err);
        }
      })
    }
    
  }

  openQrCode(){

    this.modalRef2 = this.modalService.open(QrCodeModalComponent, { size: 'sm', centered: true });
    this.modalRef2.componentInstance.id = this.candidate.uuid;
    this.modalRef2.result
      .then((result) => {
      })  
      .catch((reason) => {});
  }

  openModal(){
    this.modalRef = this.modalService.open(VideoPlayerModalComponent, { centered: true, windowClass: 'video-modal-no-bg' });
    this.modalRef.componentInstance.videoId = this.candidate.videoId;
    this.modalRef.result
      .then((result) => {
      })
      .catch((reason) => {});
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
  
  goToVideo(){
    if(this.candidate.videoId){
      this.router.navigate(['/profile/video']);
    }
    else{
      // this.toastr.info("No Video Uploaded Yet")
      this.toastr.info('No Video Uploaded Yet', '',{
        positionClass: 'toast-top-right',
      });
    }
  }

  goToPersonalDetails(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit:true,
      }
    }
    this.router.navigate(['signup/personal-details'],navigationExtras)
  }

  openNav() {
    if(!this.hasParams){
      document.getElementById("mySidenav").style.width = "250px";
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['login']);
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  getCandidateInfo(){
    this.loading = true;
    this.profileService.getCandidateById(this.candidateId).subscribe({
      next:(res : any)=>{
        console.log(res);
        this.candidate = res.data;
        this.candidate.candidateSkills = this.candidate.candidateSkills.slice().sort((a, b) => b.skillLevel - a.skillLevel);
        // this.getImage();
        localStorage.setItem('formData',JSON.stringify(this.candidate));
        // localStorage.setItem('userId',res.id)
        localStorage.setItem('CandidateId',String(this.candidate?.currentAddress?.candidateId))
        this.imageUrl = (environment.url+'media/user_images/' + this.candidate?.dpId);
        this.imageLoading = true;
        this.loading = false;
        this.checkPageFullyLoaded();
        // this.getVideo();
        
      },
      error:(err : HttpErrorResponse)=>{
        console.log(err);
        this.loading = false
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
    })
  }

  openMailClient() {
    if (this.mailId) {
      window.location.href = `mailto:${this.mailId}`;
    }
  }

  onImageLoad() {
    this.imageLoading = false;
    this.checkPageFullyLoaded();
  }

  onImageError() {
    this.imageLoading = false;
    this.checkPageFullyLoaded();
  }

  checkPageFullyLoaded() {
    // Only hide loader when both data loading and image loading are complete
    if (!this.loading && !this.imageLoading) {
      setTimeout(() => {
        this.pageFullyLoaded = true;
      }, 500); // Small delay for smooth transition
    }
  }

}
