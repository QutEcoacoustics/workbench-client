import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { testProviders, validationMessages } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { MockProjectsService } from "src/app/services/baw-api/mock/projectsMockService";
import { MockSecurityService } from "src/app/services/baw-api/mock/securityMockService";
import { MockSitesService } from "src/app/services/baw-api/mock/sitesMockService";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { EditComponent } from "./edit.component";

describe("SitesEditComponent", () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        FormlyModule.forRoot({
          validationMessages
        })
      ],
      declarations: [EditComponent],
      providers: [
        ...testProviders,
        { provide: SecurityService, useClass: MockSecurityService },
        { provide: ProjectsService, useClass: MockProjectsService },
        { provide: SitesService, useClass: MockSitesService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
