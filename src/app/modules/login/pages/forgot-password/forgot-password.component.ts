import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{
  public emailId : string;
  public otp : number;
  public newPassword : string;
  public confirmPassword : string;
  public formType : string = 'EMAIL';
  public loading : boolean = false;

  constructor(private router: Router,
    private loginService : LoginService,
    private toastr : ToastrService,
    private activeRoute: ActivatedRoute
  ){

  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      if (params['formType']) {
        this.formType = params['formType'];
      }
    });
  }


  forgotPassword(){
    this.loading = true;
    this.loginService.sentOTP({email : this.emailId}).subscribe({
      next:(res)=>{
        this.toastr.success('OTP sent successfully');
        this.formType = 'OTP';
        this.setNavigatioExtras(this.formType);
      },
      error:(err)=>{
        console.log(err);
        this.toastr.error(err.error.error);
      }
    })
  }

  verifyOtp(){
    if(this.newPassword !== this.confirmPassword){
      this.toastr.error('Passwords do not match');
    }
    else{
      this.loginService.validateOTP({email : this.emailId, otp : this.otp}).subscribe({
        next:(res)=>{
          this.toastr.success('OTP verified successfully');
          this.formType = 'NEW_PASSWORD';
          this.setNavigatioExtras(this.formType);
        },
        error:(err)=>{
          console.log(err);
          this.toastr.error(err.error.error);
        }
      })
    }
    
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  updatePassword(){
    this.loginService.updatePassword({email : this.emailId, new_password : this.newPassword, otp : this.otp}).subscribe({
      next:(res)=>{
        this.toastr.success('Password updated successfully');
        this.goToLogin();
      },
      error:(err)=>{
        console.log(err);
        this.toastr.error(err.error.error);
      }
    })
  }

  setNavigatioExtras(formType : string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        formType: formType,
      },
    };
    this.router.navigate(['login/forgot-password'], navigationExtras);
  }
}
