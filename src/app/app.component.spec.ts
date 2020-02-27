import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { BehaviorSubject, Subject } from "rxjs";
import { AppComponent } from "./app.component";
import { appImports } from "./app.module";
import { homeMenuItem } from "./component/home/home.menus";
import { projectsMenuItem } from "./component/projects/projects.menus";
import { Project } from "./models/Project";
import { ProjectsService } from "./services/baw-api/projects.service";
import { SecurityService } from "./services/baw-api/security.service";
import { UserService } from "./services/baw-api/user.service";
import { DeploymentEnvironmentService } from "./services/environment/deployment-environment.service";
import { testBawServices } from "./test.helper";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let env: DeploymentEnvironmentService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          homeMenuItem.route.routeConfig,
          projectsMenuItem.route.routeConfig
        ]),
        HttpClientTestingModule,
        LoadingBarHttpClientModule,
        ...appImports
      ],
      declarations: [AppComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    env = TestBed.inject(DeploymentEnvironmentService);
    httpMock = TestBed.inject(HttpTestingController);
    const projectsApi = TestBed.inject(ProjectsService);
    const securityApi = TestBed.inject(SecurityService);
    const userApi = TestBed.inject(UserService);

    spyOn(securityApi, "isLoggedIn").and.callFake(() => {
      return false;
    });
    spyOn(securityApi, "getAuthTrigger").and.callFake(
      () => new BehaviorSubject(null)
    );
    spyOn(userApi, "getSessionUser").and.callFake(() => {
      return null;
    });
    spyOn(projectsApi, "list").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([
          new Project({
            id: 1,
            name: "Project",
            creatorId: 1,
            description: "Description",
            siteIds: new Set([])
          })
        ]);
        subject.complete();
      }, 50);

      return subject;
    });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create the app", () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  xit("should create full page layout component", fakeAsync(() => {
    flush();
    fixture.detectChanges();

    router.navigate(homeMenuItem.route.toRoute());
    flush();
    fixture.detectChanges();

    const req = httpMock.expectOne(env.getEnvironment().cmsRoot + "/home.html");
    req.flush("<h1>Title</h1><p>Paragraph</p>");
    tick(100);
    fixture.detectChanges();

    const secondary = fixture.nativeElement.querySelector("#secondary.hidden");
    const page = fixture.nativeElement.querySelector("#page.full-width");
    const action = fixture.nativeElement.querySelector("#action.hidden");
    expect(secondary).toBeTruthy();
    expect(page).toBeTruthy();
    expect(action).toBeTruthy();
  }));

  xit("should create menu layout component", () => {});
  xit("should change layout after navigation", () => {});

  it("should create header", () => {
    const header = fixture.nativeElement.querySelector("app-header");
    expect(header).toBeTruthy();
  });

  it("should create footer", () => {
    const footer = fixture.nativeElement.querySelector("app-footer");
    expect(footer).toBeTruthy();
  });

  it("should create content", () => {
    const content = fixture.nativeElement.querySelector("div.content");
    expect(content).toBeTruthy();
    const routerOutlet = content.querySelector("router-outlet");
    expect(routerOutlet).toBeTruthy();
  });

  xit("should display loading animation on requests longer than 3 seconds", () => {});
});
