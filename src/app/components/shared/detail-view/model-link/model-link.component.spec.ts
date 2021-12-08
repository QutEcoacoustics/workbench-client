import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModelLinkComponent } from "./model-link.component";

// TODO
xdescribe("ModelLinkComponent", () => {
  let component: ModelLinkComponent;
  let fixture: ComponentFixture<ModelLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelLinkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
