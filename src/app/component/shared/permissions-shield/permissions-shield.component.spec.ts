import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { UserBadgeComponent } from "../user-badges/user-badge/user-badge.component";
import { UserBadgesComponent } from "../user-badges/user-badges.component";
import { PermissionsShieldComponent } from "./permissions-shield.component";

describe("PermissionsShieldComponent", () => {
  let component: PermissionsShieldComponent;
  let fixture: ComponentFixture<PermissionsShieldComponent>;
  let defaultProject: Project;
  let defaultSite: Site;
  let defaultError: ApiErrorDetails;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails,
    site: Site,
    siteError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [
        PermissionsShieldComponent,
        UserBadgesComponent,
        UserBadgeComponent
      ],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute({
            project:
              project || projectError
                ? {
                    model: project,
                    error: projectError
                  }
                : undefined,
            site:
              site || siteError
                ? {
                    model: site,
                    error: siteError
                  }
                : undefined
          })
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsShieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project({
      id: 1,
      name: "Project"
    });
    defaultSite = new Site({
      id: 1,
      name: "Site"
    });
    defaultError = {
      status: 401,
      message: "Unauthorized"
    };
  });

  it("should create three user badges for project", fakeAsync(() => {
    const project = new Project({
      id: 1,
      name: "Project",
      creatorId: 1,
      createdAt: "2019-01-01",
      updaterId: 1,
      updatedAt: "2019-01-01",
      ownerId: 1
    });

    configureTestingModule(project, undefined, undefined, undefined);

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(3);
  }));

  it("should create two user badges for site", fakeAsync(() => {
    const site = new Site({
      id: 1,
      name: "Site",
      creatorId: 1,
      createdAt: "2019-01-01",
      updaterId: 1,
      updatedAt: "2019-01-01"
    });

    configureTestingModule(undefined, undefined, site, undefined);

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(2);
  }));

  // TODO
  xit("should handle project error", () => {});
  xit("should handle site error", () => {});
  xit("should display your access level when owner", () => {});
  xit("should display your access level when writer", () => {});
  xit("should display your access level when reader", () => {});
});
