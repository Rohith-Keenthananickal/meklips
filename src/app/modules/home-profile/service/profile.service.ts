import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { Candidate } from '../../signup/models/signup.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  constructor(private http: HttpClient,private router: Router) { }

  getUserData(){
    return this.http.get(`${environment.url}/api/Candidates`)
  }

  getImage(id: number){
    return this.http.get(`${environment.url}/api/Dp/${id}/download`,{
      responseType: 'blob'
    })
  }

  getVideo(id: number){
    return this.http.get(`${environment.url}/api/Video/${id}/download`)
  }
}
