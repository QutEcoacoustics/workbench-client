import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchPeopleComponent } from './people.component';

describe('ResearchPeopleComponent', () => {
  let component: ResearchPeopleComponent;
  let fixture: ComponentFixture<ResearchPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResearchPeopleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
