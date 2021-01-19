import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AnnotationComponent } from "./details.component";

xdescribe("AnnotationComponent", () => {
  let component: AnnotationComponent;
  let fixture: ComponentFixture<AnnotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnotationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
