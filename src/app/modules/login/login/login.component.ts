import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../models/login.models';
import { LoginService } from '../service/login.service';
import { AuthService } from 'src/app/common-services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public user = new Login();
  public loading : boolean = false;

  constructor(private router:Router,
    private loginService : LoginService,
    private authService: AuthService,
    private toastr: ToastrService){
    
  }

  validateEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!this.user.email) {
      this.toastr.error('Email is required', 'Validation Error', {
        positionClass: 'toast-top-right',
      });
      return false;
    } else if (!emailRegex.test(this.user.email)) {
      this.toastr.error('Please enter a valid email address', 'Validation Error', {
        positionClass: 'toast-top-right',
      });
      return false;
    }
    return true;
  }

  // advancedView(){
  //   this.router.navigate(['profile']);
  // }

  // login(){
  //   this.loginService.login(this.user).subscribe({
  //     next:(res:any)=>{
  //       console.log(res);
  //       this.router.navigate(['profile']);
        
  //     },
  //     error:(err)=>{
  //       console.log(err);
        
  //     }
  //   }
      
  //   )
  // }

  goToForgotPassword(){
    this.router.navigate(['login/forgot-password']);
  }

  login() {
    // Validate email first
    if (!this.validateEmail()) {
      return;
    }

    // Validate password
    if (!this.user.password || this.user.password.length === 0) {
      this.toastr.error('Password is required', 'Validation Error', {
        positionClass: 'toast-top-right',
      });
      return;
    }

    this.loading = true;
    localStorage.setItem("meklips.email",this.user.email)
    this.authService.login(this.user).subscribe(
      (response) => {
        // Successful login, handle the response or navigate to a different page
        console.log(response);
        let userId = response?.data?.user?.id
        localStorage.setItem("meklips.userId",userId)
        this.loading = false;
        
        this.router.navigate(['login/welcome']);
        
      },
      (error) => {
        this.loading = false;
      
        // Handle login error
        console.error('Login error:', error);
        if(error.status == 401){
          
        }
        this.toastr.error('Incorrect Email or Password', 'Error', {
          positionClass: 'toast-top-right',
        });
      }
    );
  }


  
}
