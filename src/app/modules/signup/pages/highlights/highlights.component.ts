import { Component, OnInit } from '@angular/core';
import { ParamMap, Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Candidate, CandidateHighlight } from '../../models/signup.models';
import { Subscription } from 'rxjs';
import { FormDataService } from '../../service/form-data.service';
import { SignupService } from '../../service/signup.service';
import { ToastrService } from 'ngx-toastr';
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
  public selectedHighlightIndex : number;
  constructor(private router: Router,
    private activeRoute:ActivatedRoute,
    private formDataService: FormDataService,
    private signupService : SignupService,
    private toastr : ToastrService) {
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

  goToNextPage(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit:true,
      }
    }
    this.router.navigate(['signup/profile-summary'],navigationExtras)
  }

  updateData(){
    this.addHighlight()
    this.updateFormData();
    this.loader = true
    console.log(this.candidate);
    let id = localStorage.getItem('meklips.userId')
    let payload = new Candidate();
    let highLights : CandidateHighlight[];
    highLights = this.candidateHighlightsList
    payload.candidateHighlights = highLights
    this.signupService.updateCandidate(payload,id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.loader = false
        this.toastr.success('Highlights Updated', 'Success', {
          positionClass: 'toast-top-right',
        });
        this.router.navigate(['profile']);
      },
      error:(err : any)=>{
        console.log(err);
        this.loader = false
        this.toastr.error('Error While Updating Highlights', 'Error', {
          positionClass: 'toast-top-right',
        });
      }
    })
  }

  back(){
    this.router.navigate(['signup/personal-details']);
  }

  advancedView(){
    this.addHighlight();
    this.updateFormData();
    if(this.candidateHighlightsList?.length < 2){
      this.toastr.error('Please Add Atleast Two Highlight', 'Error', {
        positionClass: 'toast-top-right',
      });
    }
    else{
      this.router.navigate(['signup/profile-summary']);
    }
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
      this.candidateHighlightsList.splice(this.selectedHighlightIndex, 0, this.candidateHighlights);
      // this.candidateHighlightsList.push(this.candidateHighlights);
      this.candidateHighlights = new CandidateHighlight();
      console.log(this.candidateHighlightsList);
    }
  }

  editHighlight(index: number){
    this.candidateHighlights = this.candidateHighlightsList[index];
    this.selectedHighlightIndex = index;
    this.candidateHighlightsList.splice(index, 1);
  }

  deleteHighlight(index: number){
    this.candidateHighlightsList.splice(index, 1);
  }
  
}
