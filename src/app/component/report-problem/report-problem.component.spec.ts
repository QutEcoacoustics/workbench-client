import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import { ReportProblemComponent } from "./report-problem.component";

describe("ReportProblemComponent", () => {
  let component: ReportProblemComponent;
  let fixture: ComponentFixture<ReportProblemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, MockAppConfigModule],
      declarations: [ReportProblemComponent],
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
