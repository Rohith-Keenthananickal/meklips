import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common-services/auth.service';
import { ProfileService } from '../../service/profile.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/modules/signup/models/signup.models';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  public candidateId : number;
  public candidate : Candidate;
  public loader : boolean;
  public selectedHighlight : number = 0;
  constructor(private authService: AuthService,
    private profileService : ProfileService,
    private toastr: ToastrService,
    private router:Router){

  }

  ngOnInit() {
    this.candidateId = Number(localStorage.getItem('meklips.userId'));
    this.getCandidateInfo();
  }

  getCandidateInfo(){
    this.profileService.getCandidateById(this.candidateId).subscribe({
      next:(res : any)=>{
        console.log(res);
        this.candidate = res.data;
        this.candidate.candidateSkills = this.candidate.candidateSkills.slice().sort((a, b) => b.skillLevel - a.skillLevel);
        // this.getImage();
        localStorage.setItem('formData',JSON.stringify(this.candidate));
        // localStorage.setItem('userId',res.id)
        localStorage.setItem('CandidateId',String(this.candidate?.currentAddress?.candidateId))
        this.loader = false
        // this.getVideo();
        
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
    })
  }



}
