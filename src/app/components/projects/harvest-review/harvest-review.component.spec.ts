import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarvestReviewComponent } from './harvest-review.component';

xdescribe('HarvestReviewComponent', () => {
  let component: HarvestReviewComponent;
  let fixture: ComponentFixture<HarvestReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HarvestReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HarvestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
