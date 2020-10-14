import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MyAnnotationsComponent } from "./my-annotations.component";

xdescribe("MyAnnotationsComponent", () => {
  let component: MyAnnotationsComponent;
  let fixture: ComponentFixture<MyAnnotationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyAnnotationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
