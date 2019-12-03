import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "src/app/component/shared/shared.module";
import { MockProjectsService } from "src/app/services/baw-api/mock/projectsMockService";
import { MockSecurityService } from "src/app/services/baw-api/mock/securityMockService";
import { MockSitesService } from "src/app/services/baw-api/mock/sitesMockService";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { DetailsComponent } from "./details.component";

describe("ProjectDetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [DetailsComponent],
      providers: [
        { provide: SecurityService, useClass: MockSecurityService },
        { provide: ProjectsService, useClass: MockProjectsService },
        { provide: SitesService, useClass: MockSitesService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
