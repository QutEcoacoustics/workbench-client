import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HarvestCompleteComponent } from "./harvest-complete.component";

xdescribe("HarvestCompleteComponent", () => {
  let component: HarvestCompleteComponent;
  let fixture: ComponentFixture<HarvestCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HarvestCompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HarvestCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
