import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CandidateNotFoundComponent } from './candidate-not-found.component';

describe('CandidateNotFoundComponent', () => {
  let component: CandidateNotFoundComponent;
  let fixture: ComponentFixture<CandidateNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ CandidateNotFoundComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({})
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display candidate not found message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-title').textContent).toContain('Candidate Not Found');
  });

  it('should have navigation buttons', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.btn-primary')).toBeTruthy();
    expect(compiled.querySelector('.btn-outline-primary')).toBeTruthy();
  });
}); 