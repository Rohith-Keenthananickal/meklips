import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWelcomeComponent } from './login-welcome.component';

describe('LoginWelcomeComponent', () => {
  let component: LoginWelcomeComponent;
  let fixture: ComponentFixture<LoginWelcomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginWelcomeComponent]
    });
    fixture = TestBed.createComponent(LoginWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
