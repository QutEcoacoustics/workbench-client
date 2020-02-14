import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { testBawServices } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { AssignComponent } from "./assign.component";

describe("AssignComponent", () => {
  let component: AssignComponent;
  let fixture: ComponentFixture<AssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssignComponent],
      imports: [SharedModule, RouterTestingModule, HttpClientModule],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
