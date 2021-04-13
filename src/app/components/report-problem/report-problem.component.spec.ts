import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import { ReportProblemComponent } from "./report-problem.component";

// TODO Implement tests

describe("ReportProblemComponent", () => {
  let component: ReportProblemComponent;
  let fixture: ComponentFixture<ReportProblemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        MockBawApiModule,
        RouterTestingModule,
      ],
      declarations: [ReportProblemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
