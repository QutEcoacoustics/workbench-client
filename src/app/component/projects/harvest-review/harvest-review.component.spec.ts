import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HarvestReviewComponent } from "./harvest-review.component";

xdescribe("HarvestReviewComponent", () => {
  let component: HarvestReviewComponent;
  let fixture: ComponentFixture<HarvestReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HarvestReviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
