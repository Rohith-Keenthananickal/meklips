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
