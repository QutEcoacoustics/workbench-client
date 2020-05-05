import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { BehaviorSubject, Subject } from "rxjs";
import { AppComponent } from "./app.component";
import { appLibraryImports } from "./app.module";
import { homeMenuItem } from "./component/home/home.menus";
import { SharedModule } from "./component/shared/shared.module";
import { Project } from "./models/Project";
import { AppConfigService } from "./services/app-config/app-config.service";
import { ProjectsService } from "./services/baw-api/project/projects.service";
import { SecurityService } from "./services/baw-api/security/security.service";
import { UserService } from "./services/baw-api/user/user.service";
import { testBawServices } from "./test/helpers/testbed";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let env: AppConfigService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        HttpClientTestingModule,
        LoadingBarHttpClientModule,
      ],
      declarations: [AppComponent],
      providers: [...testBawServices],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    env = TestBed.inject(AppConfigService);
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
    spyOn(userApi, "getLocalUser").and.callFake(() => {
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
            siteIds: new Set([]),
          }),
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

    const req = httpMock.expectOne(env.environment.cmsRoot + "/home.html");
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
