import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { BehaviorSubject, Subject } from "rxjs";
import { testBawServices } from "src/app/app.helper";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { UserBadgeComponent } from "../user-badges/user-badge/user-badge.component";
import { UserBadgesComponent } from "../user-badges/user-badges.component";
import { PermissionsShieldComponent } from "./permissions-shield.component";

describe("PermissionsShieldComponent", () => {
  let component: PermissionsShieldComponent;
  let fixture: ComponentFixture<PermissionsShieldComponent>;
  let httpMock: HttpTestingController;
  let sitesApi: SitesService;
  let projectsApi: ProjectsService;

  const imports = [RouterTestingModule, HttpClientTestingModule];
  const declarations = [
    PermissionsShieldComponent,
    UserBadgesComponent,
    UserBadgeComponent
  ];

  afterEach(() => {
    httpMock.verify();
  });

  it("should detect profile url", () => {
    class MockActivatedRoute {
      public params = new BehaviorSubject<any>({ projectId: 1 });
    }

    TestBed.configureTestingModule({
      imports,
      declarations,
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsShieldComponent);
    httpMock = TestBed.get(HttpTestingController);
    projectsApi = TestBed.get(ProjectsService);
    component = fixture.componentInstance;

    projectsApi.show = jasmine.createSpy();

    fixture.detectChanges();

    expect(projectsApi.show).toHaveBeenCalled();
  });

  it("should detect site url", () => {
    class MockActivatedRoute {
      public params = new BehaviorSubject<any>({ projectId: 1, siteId: 1 });
    }

    TestBed.configureTestingModule({
      imports,
      declarations,
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsShieldComponent);
    httpMock = TestBed.get(HttpTestingController);
    sitesApi = TestBed.get(SitesService);
    component = fixture.componentInstance;

    sitesApi.show = jasmine.createSpy();

    fixture.detectChanges();

    expect(sitesApi.show).toHaveBeenCalled();
  });

  it("should create three user badges for profile", fakeAsync(() => {
    class MockActivatedRoute {
      public params = new BehaviorSubject<any>({ projectId: 1 });
    }

    TestBed.configureTestingModule({
      imports,
      declarations,
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsShieldComponent);
    httpMock = TestBed.get(HttpTestingController);
    projectsApi = TestBed.get(ProjectsService);
    component = fixture.componentInstance;

    spyOn(projectsApi, "show").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Test Project",
            creatorId: 1,
            createdAt: "2019-01-01",
            updaterId: 1,
            updatedAt: "2019-01-01",
            ownerId: 1,
            description: "Test description",
            siteIds: new Set([])
          })
        );
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(3);
  }));

  it("should create two user badges for site", fakeAsync(() => {
    class MockActivatedRoute {
      public params = new BehaviorSubject<any>({ projectId: 1, siteId: 1 });
    }

    TestBed.configureTestingModule({
      imports,
      declarations,
      providers: [
        ...testBawServices,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsShieldComponent);
    httpMock = TestBed.get(HttpTestingController);
    sitesApi = TestBed.get(SitesService);
    component = fixture.componentInstance;

    spyOn(sitesApi, "show").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            createdAt: "2019-01-01",
            updaterId: 1,
            updatedAt: "2019-01-01",
            description: "Test description",
            projectIds: new Set([])
          })
        );
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const badges = fixture.nativeElement.querySelectorAll("app-user-badge");
    expect(badges).toBeTruthy();
    expect(badges.length).toBe(2);
  }));

  xit("should display your access level when owner", () => {});
  xit("should display your access level when writer", () => {});
  xit("should display your access level when reader", () => {});
});
