import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RenderViewComponent } from "./view.component";

describe("RenderViewComponent", () => {
  let component: RenderViewComponent;
  let fixture: ComponentFixture<RenderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RenderViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
