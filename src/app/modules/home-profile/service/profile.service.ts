import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { Candidate } from '../../signup/models/signup.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  constructor(private http: HttpClient,private router: Router) { }

  getUserData(){
    return this.http.get(`${environment.url}/candidates`)
  }

  getCandidateById(id : number){
    return this.http.get(`${environment.url}api/candidates/${id}`)
  }

  getImage(id: number){
    return this.http.get(`${environment.url}/api/Dp/${id}/download`,{
      responseType: 'blob'
    })
  }

  getVideo(id: number){
    return this.http.get(`${environment.url}/api/Video/${id}/download`,{
      responseType: 'blob'
    })
  }

  getUserImage(id: number){
    return this.http.get(`${environment.url}/candidates/image/${id}`)
  }

  getUserVideo(id: number){
    return this.http.get(`${environment.url}/candidates/video/${id}`)
  }

  likeCandidate(id: number){
    return this.http.patch(`${environment.url}api/candidates/${id}/like`,{})
  }

}
