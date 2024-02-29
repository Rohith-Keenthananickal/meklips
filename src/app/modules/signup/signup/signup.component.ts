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

  public signUpPayload = new Signup();

  constructor(private router:Router,
    private signupService : SignupService,
    private toastr: ToastrService,
    private authService: AuthService){

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
    if(this.signUpPayload.password == this.cpassword){
      localStorage.setItem("meklips.email",this.signUpPayload.email)
      this.signupService.signup(this.signUpPayload).subscribe({
        next:(res: any)=>{
          console.log(res);
          if(res.status == 200){
            this.login();
            
            
            
          }
        },
        error:(err:any)=>{
          console.log(err);
          console.log(err.error.errors);
          const errorValues = Object.values(err.error.errors)[0];
          const errorMessage = errorValues[0];
          console.log(errorMessage);
        
          this.toastr.error(errorMessage, 'Error', {
            positionClass: 'toast-top-right',
          });
        }
      })
      
    }
    else{
      // this.toastr.error('Password and Conform Password should be Same'),{
      //   positionClass: 'toast-top-right'}
      this.toastr.error('Password and Conform Password should be Same', 'Error', {
        positionClass: 'toast-top-right',
      });
    }

  }

  login() {
    this.authService.login(this.signUpPayload).subscribe({
      next:(res)=>{
        // Successful login, handle the response or navigate to a different page
        console.log(res);
        this.advancedView();
      },
      error:(err)=>{
        console.error('Login error:', err);
      }
    }
    );
  }

  advancedView(){
    
    this.router.navigate(['signup/password-update']);
  }
}
