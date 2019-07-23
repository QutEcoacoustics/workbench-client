import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchArticlesComponent } from './articles.component';

describe('ResearchArticlesComponent', () => {
  let component: ResearchArticlesComponent;
  let fixture: ComponentFixture<ResearchArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResearchArticlesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
