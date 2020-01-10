import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HarvestComponent } from "./harvest.component";

describe("HarvestComponent", () => {
  let component: HarvestComponent;
  let fixture: ComponentFixture<HarvestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HarvestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
