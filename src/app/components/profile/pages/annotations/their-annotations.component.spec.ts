import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TheirAnnotationsComponent } from "./their-annotations.component";

xdescribe("TheirAnnotationsComponent", () => {
  let component: TheirAnnotationsComponent;
  let fixture: ComponentFixture<TheirAnnotationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheirAnnotationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TheirAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
