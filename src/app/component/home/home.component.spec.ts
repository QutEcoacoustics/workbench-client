import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { ProjectsService } from "@baw-api/projects.service";
import { SecurityService } from "@baw-api/security.service";
import { Project } from "@models/Project";
import { AppConfigService } from "@services/app-config/app-config.service";
import { SharedModule } from "@shared/shared.module";
import { BehaviorSubject, Subject } from "rxjs";
import { delay } from "rxjs/operators";
import { testBawServices } from "src/app/test/helpers/testbed";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let httpMock: HttpTestingController;
  let projectApi: ProjectsService;
  let securityApi: SecurityService;
  let component: HomeComponent;
  let env: AppConfigService;
  let fixture: ComponentFixture<HomeComponent>;
  let cmsUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [SharedModule, HttpClientTestingModule, RouterTestingModule],
      providers: [...testBawServices],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    projectApi = TestBed.inject(ProjectsService);
    securityApi = TestBed.inject(SecurityService);
    env = TestBed.inject(AppConfigService);

    cmsUrl = env.environment.cmsRoot + "/home.html";
  });

  afterEach(() => {
    httpMock.verify();
  });

  function handleCms(waitTime?: number) {
    const req = httpMock.expectOne(cmsUrl);
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    if (waitTime) {
      tick(waitTime);
    } else {
      flush();
    }
    fixture.detectChanges();
  }

  it("should create", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake(() => {
      const subject = new Subject<Project[]>();

      subject.pipe(delay(50));
      subject.next([]);

      return subject;
    });

    tick(100);
    fixture.detectChanges();

    handleCms();

    expect(component).toBeTruthy();
  }));

  it("should load cms", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake(() => {
      const subject = new Subject<Project[]>();

      subject.pipe(delay(50));
      subject.next([]);

      return subject;
    });

    tick(100);
    fixture.detectChanges();

    handleCms();

    const header = fixture.nativeElement.querySelector("h1");
    const body = fixture.nativeElement.querySelector("p");

    expect(header).toBeTruthy();
    expect(header.innerText.trim()).toBe("Test Header");
    expect(body).toBeTruthy();
    expect(body.innerText.trim()).toBe("Test Description");
  }));

  it("should handle filter error", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.error({ status: 404, message: "Not Found" } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    tick(100);
    fixture.detectChanges();

    handleCms();

    const cards = fixture.nativeElement.querySelectorAll("app-card-image");
    const button = fixture.nativeElement.querySelector("button");

    expect(cards.length).toBe(0);
    expect(button).toBeTruthy();
  }));

  it("should filter projects to have 3 items", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake((filter) => {
      expect(filter).toBeTruthy();
      expect(filter).toEqual({ paging: { items: 3 } } as Filters);

      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    tick(100);
    fixture.detectChanges();

    handleCms();
  }));

  it("should display empty project in filter", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    tick(100);
    fixture.detectChanges();

    handleCms();

    const cards = fixture.nativeElement.querySelectorAll("app-card-image");
    const button = fixture.nativeElement.querySelector("button");

    expect(cards.length).toBe(0);
    expect(button).toBeTruthy();
  }));

  it("should display single project in filter", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake(() => {
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
      }, 50);

      return subject;
    });

    fixture.detectChanges();

    handleCms();

    const cards = fixture.nativeElement.querySelectorAll("app-card-image");
    const button = fixture.nativeElement.querySelector("button");

    expect(cards.length).toBe(1);
    expect(cards[0].querySelector(".card-title").innerText.trim()).toBe(
      "Project"
    );
    expect(cards[0].querySelector(".card-text").innerText.trim()).toBe(
      "Description"
    );
    expect(button).toBeTruthy();
  }));

  it("should display three projects in filter", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([
          new Project({
            id: 1,
            name: "Project 1",
            creatorId: 1,
            description: "Description 1",
            siteIds: new Set([]),
          }),
          new Project({
            id: 2,
            name: "Project 2",
            creatorId: 1,
            description: "Description 2",
            siteIds: new Set([]),
          }),
          new Project({
            id: 3,
            name: "Project 3",
            creatorId: 1,
            description: "Description 3",
            siteIds: new Set([]),
          }),
        ]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();

    handleCms();

    const cards = fixture.nativeElement.querySelectorAll("app-card-image");
    const button = fixture.nativeElement.querySelector("button");

    expect(cards.length).toBe(3);
    expect(cards[0].querySelector(".card-title").innerText.trim()).toBe(
      "Project 1"
    );
    expect(cards[0].querySelector(".card-text").innerText.trim()).toBe(
      "Description 1"
    );
    expect(cards[1].querySelector(".card-title").innerText.trim()).toBe(
      "Project 2"
    );
    expect(cards[1].querySelector(".card-text").innerText.trim()).toBe(
      "Description 2"
    );
    expect(cards[2].querySelector(".card-title").innerText.trim()).toBe(
      "Project 3"
    );
    expect(cards[2].querySelector(".card-text").innerText.trim()).toBe(
      "Description 3"
    );
    expect(button).toBeTruthy();
  }));

  it("should link to project details page", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();

    handleCms();

    const button = fixture.nativeElement.querySelector("button");
    expect(button).toBeTruthy();
    expect(button.innerText.trim()).toBe("More Projects");
    expect(
      button.attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy();
    expect(button.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      "/projects"
    );
  }));

  it("should request 3 projects", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake((params) => {
      expect(params).toEqual({ paging: { items: 3 } } as Filters);
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    tick(100);
    fixture.detectChanges();

    handleCms();
  }));

  it("should update on logout", fakeAsync(() => {
    let count = 0;

    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      const subject = new BehaviorSubject(null);

      setTimeout(() => {
        subject.next(null);
      }, 500);

      return subject;
    });
    spyOn(projectApi, "filter").and.callFake((params) => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        if (count === 0) {
          count++;
          subject.next([]);
        } else {
          subject.next([
            new Project({
              id: 1,
              name: "Project 1",
              creatorId: 1,
              description: "Description 1",
              siteIds: new Set([]),
            }),
            new Project({
              id: 2,
              name: "Project 2",
              creatorId: 1,
              description: "Description 2",
              siteIds: new Set([]),
            }),
            new Project({
              id: 3,
              name: "Project 3",
              creatorId: 1,
              description: "Description 3",
              siteIds: new Set([]),
            }),
          ]);
        }
      }, 50);

      return subject;
    });

    tick(100);
    fixture.detectChanges();

    handleCms(100);

    // Should initially have zero cards
    let cards = fixture.nativeElement.querySelectorAll("app-card-image");

    expect(cards.length).toBe(0);

    flush();
    fixture.detectChanges();

    // After login status changes, should have 3
    cards = fixture.nativeElement.querySelectorAll("app-card-image");

    expect(cards.length).toBe(3);
  }));
});
