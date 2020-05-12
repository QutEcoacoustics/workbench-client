import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MyAnnotationsComponent } from "./my-annotations.component";

xdescribe("MyAnnotationsComponent", () => {
  let component: MyAnnotationsComponent;
  let fixture: ComponentFixture<MyAnnotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyAnnotationsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
