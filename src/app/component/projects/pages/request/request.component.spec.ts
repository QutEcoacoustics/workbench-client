import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyModule } from "@ngx-formly/core";
import { validationMessages } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { MockProjectsService } from "src/app/services/baw-api/mock/projectsMockService";
import { MockSecurityService } from "src/app/services/baw-api/mock/securityMockService";
import { MockSitesService } from "src/app/services/baw-api/mock/sitesMockService";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { RequestComponent } from "./request.component";

describe("ProjectsRequestComponent", () => {
  let component: RequestComponent;
  let fixture: ComponentFixture<RequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        SharedModule,
        FormlyModule.forRoot({
          validationMessages
        })
      ],
      declarations: [RequestComponent],
      providers: [
        { provide: SecurityService, useClass: MockSecurityService },
        { provide: ProjectsService, useClass: MockProjectsService },
        { provide: SitesService, useClass: MockSitesService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
