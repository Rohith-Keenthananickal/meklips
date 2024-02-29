import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-welcome',
  templateUrl: './login-welcome.component.html',
  styleUrls: ['./login-welcome.component.scss']
})
export class LoginWelcomeComponent implements OnInit{
  public email : string;

  constructor(private router:Router){
    
  }
  ngOnInit(): void {
    this.email = localStorage.getItem('meklips.email')
  }

  goToProfile(){
    this.router.navigate(['profile']);
  }

}
