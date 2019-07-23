import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebStatisticsComponent } from './web-statistics.component';

describe('WebStatisticsComponent', () => {
  let component: WebStatisticsComponent;
  let fixture: ComponentFixture<WebStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WebStatisticsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
