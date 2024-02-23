import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { Candidate, CandidateSkill, Signup, Video } from '../models/signup.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient, private router: Router) { }

  signup(payload: Signup): Observable<HttpResponse<any>> {
    return this.http.post(`${environment.url}/register`, payload, { observe: 'response' });
  }

  getUserId(){
    return this.http.get(`${environment.url}/api/Candidates`)
  }

  candidateBulk(payload : Candidate){
    return this.http.post(`${environment.url}/api/Candidates`, payload);
  }

  uploadVideo(payload , userId : string, fileName : string){
    return this.http.post(`${environment.url}/api/Video/upload?CandidateId=${userId}&FileName=${fileName}`, payload);
  }

  uploadDp(payload , userId : string, fileName : string){
    return this.http.post(`${environment.url}/api/Dp/upload?CandidateId=${userId}&FileName=${fileName}`, payload);
  }

  updateCandidate(payload : Candidate, id : any){
    return this.http.put(`${environment.url}/api/Candidates/${id}`, payload);
  }

  updateSkills(payload : any, id : any, candidateId : any){
    return this.http.put(`${environment.url}/api/CandidateSkill/${candidateId}/${id}`, payload);
  }

  newSkills(payload : any){
    return this.http.post(`${environment.url}/api/CandidateSkill`, payload);
  }

  updateEducation(payload : any, id : any, candidateId : any){
    return this.http.put(`${environment.url}/api/EducationalDegree/${candidateId}/${id}`, payload);
  }

  AddEducation(payload : any){
    return this.http.post(`${environment.url}/api/EducationalDegree`, payload);
  }

  updateWorkExperiance(payload : any, id : any, candidateId : any){
    return this.http.put(`${environment.url}/api/WorkExperience/${candidateId}/${id}`, payload);
  }

  AddWorkExperiance(payload : any){
    return this.http.post(`${environment.url}/api/WorkExperience`, payload);
  }
}
