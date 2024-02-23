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
    return this.http.post(`${environment.url}/login`, payload)
  }


  
}
