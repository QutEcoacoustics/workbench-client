import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIconComponent } from './icon.component';

describe('ProfileIconComponent', () => {
  let component: ProfileIconComponent;
  let fixture: ComponentFixture<ProfileIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileIconComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
