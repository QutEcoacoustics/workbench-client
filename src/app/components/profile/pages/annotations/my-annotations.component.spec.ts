import { ComponentFixture, TestBed } from "@angular/core/testing";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { MyAnnotationsComponent } from "./my-annotations.component";

xdescribe("MyAnnotationsComponent", () => {
  let component: MyAnnotationsComponent;
  let fixture: ComponentFixture<MyAnnotationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyAnnotationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  assertPageInfo(MyAnnotationsComponent, "Annotations");

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
