import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsSiteComponent } from './site.component';

describe('ProjectsSiteComponent', () => {
  let component: ProjectsSiteComponent;
  let fixture: ComponentFixture<ProjectsSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsSiteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
