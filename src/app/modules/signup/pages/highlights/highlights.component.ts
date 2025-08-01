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
    
    // Use helper method to get valid highlights
    payload.candidateHighlights = this.getValidHighlights();
    
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
    
    // Use helper method to count valid highlights
    const validHighlightsCount = this.getValidHighlights().length;
    
    if(validHighlightsCount < 2){
      this.toastr.error('Please Add Atleast Two Highlight', 'Error', {
        positionClass: 'toast-top-right',
      });
    }
    else{
      this.router.navigate(['signup/profile-summary']);
    }
  }

  updateFormData() {
    // Use helper method to get valid highlights
    this.candidate.candidateHighlights = this.getValidHighlights();
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
    
    // Get valid highlights from the loaded data
    const validHighlights = this.candidateHighlightsList.filter(highlight => 
      highlight && 
      highlight.highlightKey && 
      highlight.highlightValue && 
      highlight.highlightKey.trim() !== '' && 
      highlight.highlightValue.trim() !== ''
    );
    
    // Initialize with 3 empty cards, but populate with existing valid data
    this.candidateHighlightsList = [];
    for (let i = 0; i < 3; i++) {
      if (validHighlights[i]) {
        this.candidateHighlightsList[i] = validHighlights[i];
      } else {
        this.candidateHighlightsList[i] = new CandidateHighlight();
      }
    }
  }

  addHighlight(){
    if((this.candidateHighlights.highlightKey && this.candidateHighlights.highlightValue)){
      if (this.selectedHighlightIndex !== undefined) {
        // Update existing highlight at the selected index
        this.candidateHighlightsList[this.selectedHighlightIndex] = { ...this.candidateHighlights };
      }
      this.candidateHighlights = new CandidateHighlight();
      this.selectedHighlightIndex = undefined;
      console.log(this.candidateHighlightsList);
    }
  }

  editHighlight(index: number){
    this.candidateHighlights = { ...this.candidateHighlightsList[index] };
    this.selectedHighlightIndex = index;
    // Clear the current position but keep the array structure intact
    this.candidateHighlightsList[index] = new CandidateHighlight();
  }

  deleteHighlight(index: number){
    // Clear the highlight at the specific index instead of removing it
    this.candidateHighlightsList[index] = new CandidateHighlight();
  }

  clearHighlight(index: number){
    if (this.candidateHighlightsList[index]) {
      this.candidateHighlightsList[index].highlightKey = '';
      this.candidateHighlightsList[index].highlightValue = '';
    }
  }

  /**
   * Helper method to filter out null, undefined, or empty highlights
   * @returns Array of valid highlights
   */
  private getValidHighlights(): CandidateHighlight[] {
    return this.candidateHighlightsList.filter(highlight => 
      highlight && 
      highlight.highlightKey && 
      highlight.highlightValue && 
      highlight.highlightKey.trim() !== '' && 
      highlight.highlightValue.trim() !== ''
    );
  }

  
}
