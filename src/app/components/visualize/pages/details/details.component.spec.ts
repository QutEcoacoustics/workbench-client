import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VisualizeComponent } from "./details.component";

describe("VisualizeComponent", () => {
  let component: VisualizeComponent;
  let fixture: ComponentFixture<VisualizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualizeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
