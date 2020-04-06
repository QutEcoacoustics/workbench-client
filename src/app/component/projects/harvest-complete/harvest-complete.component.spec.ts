import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HarvestCompleteComponent } from "./harvest-complete.component";

describe("HarvestCompleteComponent", () => {
  let component: HarvestCompleteComponent;
  let fixture: ComponentFixture<HarvestCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HarvestCompleteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
