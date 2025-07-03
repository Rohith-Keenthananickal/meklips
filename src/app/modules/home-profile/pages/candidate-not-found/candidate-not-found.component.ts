import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-candidate-not-found',
  templateUrl: './candidate-not-found.component.html',
  styleUrls: ['./candidate-not-found.component.scss']
})
export class CandidateNotFoundComponent implements OnInit {
  public uuid: string;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['uuid']) {
        this.uuid = params['uuid'];
      }
    });
    
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['uuid']) {
        this.uuid = queryParams['uuid'];
      }
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 