import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordSetComponent } from './password-set.component';

describe('PasswordSetComponent', () => {
  let component: PasswordSetComponent;
  let fixture: ComponentFixture<PasswordSetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordSetComponent]
    });
    fixture = TestBed.createComponent(PasswordSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
