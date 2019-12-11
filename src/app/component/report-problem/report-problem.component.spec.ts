import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyCustomModule } from "src/app/helpers/formly/formly.module";
import { SharedModule } from "../shared/shared.module";
import { ReportProblemComponent } from "./report-problem.component";

describe("ReportProblemComponent", () => {
  let component: ReportProblemComponent;
  let fixture: ComponentFixture<ReportProblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, FormlyCustomModule],
      declarations: [ReportProblemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
