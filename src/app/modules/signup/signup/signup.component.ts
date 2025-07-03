import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SignupService } from '../service/signup.service';
import { ToastrService } from 'ngx-toastr';
import { Signup } from '../models/signup.models';
import { AuthService } from 'src/app/common-services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  // public email : string;
  // public password : string;
  public cpassword : string;
  isPasswordValid: boolean = false;
  public loading: boolean = false;

  public signUpPayload = new Signup();

  constructor(private router:Router,
    private signupService : SignupService,
    private toastr: ToastrService,
    private authService: AuthService){

  }

  validateEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!this.signUpPayload.email) {
      this.toastr.error('Email is required', 'Validation Error', {
        positionClass: 'toast-top-right',
      });
      return false;
    } else if (!emailRegex.test(this.signUpPayload.email)) {
      this.toastr.error('Please enter a valid email address', 'Validation Error', {
        positionClass: 'toast-top-right',
      });
      return false;
    }
    return true;
  }

  validatePassword(): void {
    const minLength = 8;
    const hasNumber = /\d/.test(this.signUpPayload.password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(this.signUpPayload.password);
    const hasUppercase = /[A-Z]/.test(this.signUpPayload.password);

    this.isPasswordValid =
      this.signUpPayload.password.length >= minLength &&
      hasNumber &&
      hasSpecialCharacter &&
      hasUppercase;

    console.log(this.isPasswordValid);
    
  }

  // getMatchingErrorCodes(err: any, errorCodes: string[]): string[] {
  //   return err.error.errors
  //     .map((error: any) => error.code)
  //     .filter((errorCode: string) => errorCodes.includes(errorCode));
  // }

  signup(){
    // Validate email first
    if (!this.validateEmail()) {
      return;
    }

    // Validate password
    this.validatePassword();
    if (!this.isPasswordValid) {
      this.toastr.error('Please enter a valid password', 'Validation Error', {
        positionClass: 'toast-top-right',
      });
      return;
    }

    // Validate password confirmation
    if (this.signUpPayload.password !== this.cpassword) {
      this.toastr.error('Password and Confirm Password should be Same', 'Validation Error', {
        positionClass: 'toast-top-right',
      });
      return;
    }

    this.loading = true;
    localStorage.clear();
    localStorage.setItem("meklips.email",this.signUpPayload.email)
    this.signupService.signup(this.signUpPayload).subscribe({
      next:(res: any)=>{
        this.loading = false;
        this.advancedView();
        this.login();
      },
      error:(err:any)=>{
        this.loading = false;
        console.log(err);
        console.log(err.error.error);
        // const errorValues = Object.values(err.error.errors)[0];
        // const errorMessage = errorValues[0];
        // console.log(errorMessage);
      
        this.toastr.error(err.error.error, 'Error', {
          positionClass: 'toast-top-right',
        });
      }
    })
  }

  login() {
    this.loading = true;
    this.authService.login(this.signUpPayload).subscribe({
      next:(res)=>{
        this.loading = false;
        let userId = res?.data?.user?.id
        localStorage.setItem("meklips.userId",userId)
        this.advancedView();
      },
      error:(err)=>{
        this.loading = false;
        console.error('Login error:', err);
      }
    }
    );
  }

  advancedView(){
    
    this.router.navigate(['signup/personal-details']);
  }
}
