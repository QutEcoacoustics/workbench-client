import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchResourcesComponent } from './resources.component';

describe('ResearchResourcesComponent', () => {
  let component: ResearchResourcesComponent;
  let fixture: ComponentFixture<ResearchResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResearchResourcesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
