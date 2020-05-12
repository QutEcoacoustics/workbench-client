import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TheirAnnotationsComponent } from "./their-annotations.component";

xdescribe("TheirAnnotationsComponent", () => {
  let component: TheirAnnotationsComponent;
  let fixture: ComponentFixture<TheirAnnotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TheirAnnotationsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheirAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
