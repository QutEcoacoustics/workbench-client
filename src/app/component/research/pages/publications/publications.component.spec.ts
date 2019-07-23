import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchPublicationsComponent } from './publications.component';

describe('ResearchPublicationsComponent', () => {
  let component: ResearchPublicationsComponent;
  let fixture: ComponentFixture<ResearchPublicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResearchPublicationsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
