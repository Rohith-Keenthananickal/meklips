import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common-services/auth.service';

@Component({
  selector: 'app-password-set',
  templateUrl: './password-set.component.html',
  styleUrls: ['./password-set.component.scss']
})
export class PasswordSetComponent implements OnInit {
  constructor(private router:Router,
    private authService: AuthService){
  }
  ngOnInit(): void {
    console.log( this.authService.isAuthenticated());
    
  }

  advancedView(){
    
    this.router.navigate(['signup/personal-details']);
  }
}
