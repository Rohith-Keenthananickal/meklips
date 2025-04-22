import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { Login } from '../models/login.models';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient,private router: Router) { }

  login(payload : Login){
    return this.http.post(`${environment.url}/users/login`, payload)
  }

  sentOTP(payload : {email : string}){
    return this.http.post(`${environment.url}/api/users/forgot-password`, payload)
  }

  validateOTP(payload : {email : string, otp : number}){
    return this.http.post(`${environment.url}/api/users/validate-otp`, payload)
  }

  updatePassword(payload : {email : string, new_password : string, otp : number}){
    return this.http.post(`${environment.url}/api/users/reset-password`, payload)
  }

  
}
