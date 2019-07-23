import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchAboutComponent } from './about.component';

describe('ResearchAboutComponent', () => {
  let component: ResearchAboutComponent;
  let fixture: ComponentFixture<ResearchAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResearchAboutComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
