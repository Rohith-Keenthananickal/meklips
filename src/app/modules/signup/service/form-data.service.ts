import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Candidate } from '../models/signup.models';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  public candidate = new Candidate();
  constructor() { }

  private formDataSubject = new BehaviorSubject<any>(null);
  formData$ = this.formDataSubject.asObservable();

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  updateFormData(data: any) {
    console.log(data);
    if(!this.isEmpty(data)){
      this.formDataSubject.next(data);
      localStorage.setItem('formData', JSON.stringify(data));
    }
  }

  getLocalData(){
    let localData = localStorage.getItem('formData')
    if(localData && localData.length >0){
      let parsedData = JSON.parse(localData)
      return parsedData
    }
    else{
      return this.candidate
    }
  }
}
