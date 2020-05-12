import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "@shared/shared.module";
import { testAppInitializer } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.module";
import { ReportProblemComponent } from "./report-problem.component";

describe("ReportProblemComponent", () => {
  let component: ReportProblemComponent;
  let fixture: ComponentFixture<ReportProblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule],
      declarations: [ReportProblemComponent],
      providers: [...testAppInitializer],
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
