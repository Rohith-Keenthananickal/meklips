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
  public user = new Login()
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

  login() {
    this.authService.login(this.user).subscribe(
      (response) => {
        // Successful login, handle the response or navigate to a different page
        console.log(response);
        this.router.navigate(['profile']);
        
      },
      (error) => {
        
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
