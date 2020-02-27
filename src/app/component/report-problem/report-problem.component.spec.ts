import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "../shared/shared.module";
import { ReportProblemComponent } from "./report-problem.component";
import { testAppInitializer } from "src/app/test.helper";

describe("ReportProblemComponent", () => {
  let component: ReportProblemComponent;
  let fixture: ComponentFixture<ReportProblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule],
      declarations: [ReportProblemComponent],
      providers: [...testAppInitializer]
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
