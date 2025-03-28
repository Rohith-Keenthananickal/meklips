import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileVideoComponent } from './profile-video.component';

describe('ProfileVideoComponent', () => {
  let component: ProfileVideoComponent;
  let fixture: ComponentFixture<ProfileVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileVideoComponent]
    });
    fixture = TestBed.createComponent(ProfileVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
