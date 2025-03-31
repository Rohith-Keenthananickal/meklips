import { Component, OnInit } from '@angular/core';
import { ParamMap, Router, ActivatedRoute } from '@angular/router';
import { Candidate, CandidateHighlight } from '../../models/signup.models';
import { Subscription } from 'rxjs';
import { FormDataService } from '../../service/form-data.service';
@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.component.html',
  styleUrls: ['./highlights.component.scss']
})
export class HighlightsComponent implements OnInit{
  public loader = false;
  public candidateHighlights : CandidateHighlight = new CandidateHighlight();
  public candidateHighlightsList : CandidateHighlight[] = [];
  public editable : boolean
  public candidateId = localStorage.getItem('candidateId');
  subscription:Subscription;
  public candidate = new Candidate();
  constructor(private router: Router,
    private activeRoute:ActivatedRoute,
    private formDataService: FormDataService) {
    // this.router.navigate(['/profile']);
  }
  ngOnInit(): void {
    this.getLocalData();
    this.subscription = this.activeRoute.queryParams.subscribe(
      (params: ParamMap) => {
        console.log(params);
        this.editable = params['edit'];
        console.log(this.editable);
        
      });
  }

  back(){
    this.router.navigate(['signup/previous-employment']);
  }

  advancedView(){
    // this.addWorkExperience();
    this.addHighlight();
    this.updateFormData();
    this.router.navigate(['signup/profile-summary']);
  }

  updateFormData() {
    this.candidate.candidateHighlights = this.candidateHighlightsList;
    this.formDataService.updateFormData(this.candidate);

  }

  cancel(){
    this.router.navigate(['profile']);
  }

  getLocalData(){
    let localData = this.formDataService.getLocalData();
    this.candidate = localData
    this.candidate.candidateHighlights = this.candidate.candidateHighlights || [];
    this.candidateHighlightsList = this.candidate.candidateHighlights;
  }

  addHighlight(){
    if((this.candidateHighlights.highlightKey && this.candidateHighlights.highlightValue) &&this.candidateHighlightsList?.length < 3){
      this.candidateHighlightsList.push(this.candidateHighlights);
      this.candidateHighlights = new CandidateHighlight();
    }
  }

  editHighlight(index: number){
    this.candidateHighlights = this.candidateHighlightsList[index];
    this.candidateHighlightsList.splice(index, 1);
  }

  deleteHighlight(index: number){
    this.candidateHighlightsList.splice(index, 1);
  }
  
}
