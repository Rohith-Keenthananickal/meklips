import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { Candidate, CandidateSkill, CandidateSummaryPayload, Signup, Video } from '../models/signup.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient, private router: Router) { }

  signup(payload: Signup): Observable<HttpResponse<any>> {
    return this.http.post(`${environment.url}api/users/register`, payload, { observe: 'response' });
  }

  getUserId(){
    return this.http.get(`${environment.url}/api/Candidates`)
  }

  candidateBulk(payload : Candidate){
    return this.http.post(`${environment.url}api/candidates/`, payload);
  }

  uploadVideo(payload , userId : string, fileName : string){
    return this.http.post(`${environment.url}api/candidates/${userId}/video`, payload);
  }

  uploadDp(payload , userId : string, fileName : string){
    return this.http.post(`${environment.url}api/candidates/${userId}/image`, payload);
  }

  updateCandidate(payload : Candidate, id : any){
    return this.http.put(`${environment.url}api/candidates/${id}`, payload);
  }

  updateSkills(payload : any, id : any, candidateId : any){
    return this.http.put(`${environment.url}/api/CandidateSkill/${candidateId}/${id}`, payload);
  }

  updateSocialMedia(payload : any, id : any, candidateId : any){
    return this.http.put(`${environment.url}/api/SocialMediaLink/${candidateId}/${id}`, payload);
  }

  newSkills(payload : any){
    return this.http.post(`${environment.url}/api/CandidateSkill`, payload);
  }

  newSocialMedia(payload : any){
    return this.http.post(`${environment.url}/api/SocialMediaLink`, payload);
  }


  updateEducation(payload : any, id : any, candidateId : any){
    return this.http.put(`${environment.url}/api/EducationalDegree/${candidateId}/${id}`, payload);
  }

  AddEducation(payload : any){
    return this.http.post(`${environment.url}/api/EducationalDegree`, payload);
  }

  deleteEducation(id){
    return this.http.delete(`${environment.url}/api/EducationalDegree/${id}`);
  }

  deleteWorkExperiance(id){
    return this.http.delete(`${environment.url}/api/WorkExperience/${id}`);
  }

  deleteSkill(id){
    return this.http.delete(`${environment.url}/api/CandidateSkill/${id}`);
  }

  updateWorkExperiance(payload : any, id : any, candidateId : any){
    return this.http.put(`${environment.url}/api/WorkExperience/${candidateId}/${id}`, payload);
  }

  AddWorkExperiance(payload : any){
    return this.http.post(`${environment.url}/api/WorkExperience`, payload);
  }

  getDegree(){
    return this.http.get(`${environment.url}/api/University`);
  }

  updateCandidateSummary(payload : CandidateSummaryPayload,candidateId : any){
    return this.http.put(`${environment.url}/api/Candidates/${candidateId}/Summary`, payload);
  }
}
