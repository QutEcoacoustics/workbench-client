import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MockProjectsService } from "src/app/services/baw-api/mock/projectsMockService";
import { MockSecurityService } from "src/app/services/baw-api/mock/securityMockService";
import { MockSitesService } from "src/app/services/baw-api/mock/sitesMockService";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { ListComponent } from "./list.component";

describe("ProjectsListComponent", () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ListComponent],
      providers: [
        { provide: SecurityService, useClass: MockSecurityService },
        { provide: ProjectsService, useClass: MockProjectsService },
        { provide: SitesService, useClass: MockSitesService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
