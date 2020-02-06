import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { BehaviorSubject, Subject } from "rxjs";
import { delay } from "rxjs/operators";
import { testBawServices } from "src/app/app.helper";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { Filters } from "src/app/services/baw-api/base-api.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let projectApi: ProjectsService;
  let securityApi: SecurityService;
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [SharedModule, HttpClientTestingModule, RouterTestingModule],
      providers: [...testBawServices]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    config = TestBed.get(AppConfigService);
    projectApi = TestBed.get(ProjectsService);
    securityApi = TestBed.get(SecurityService);
  });

  afterEach(() => {
    httpMock.verify();
  });

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

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    flush();
    fixture.detectChanges();

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

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    flush();
    fixture.detectChanges();

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

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    flush();
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll("app-card-image");
    const button = fixture.nativeElement.querySelector("button");

    expect(cards.length).toBe(0);
    expect(button).toBeTruthy();
  }));

  it("should filter projects to have 3 items", fakeAsync(() => {
    spyOn(securityApi, "getAuthTrigger").and.callFake(() => {
      return new BehaviorSubject(null);
    });
    spyOn(projectApi, "filter").and.callFake(filter => {
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

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    flush();
    fixture.detectChanges();
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

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    flush();
    fixture.detectChanges();

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
            siteIds: new Set([])
          })
        ]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    flush();
    fixture.detectChanges();

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
            siteIds: new Set([])
          }),
          new Project({
            id: 2,
            name: "Project 2",
            creatorId: 1,
            description: "Description 2",
            siteIds: new Set([])
          }),
          new Project({
            id: 3,
            name: "Project 3",
            creatorId: 1,
            description: "Description 3",
            siteIds: new Set([])
          })
        ]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    flush();
    fixture.detectChanges();

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

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    flush();
    fixture.detectChanges();

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
    spyOn(projectApi, "filter").and.callFake(params => {
      expect(params).toEqual({ paging: { items: 3 } } as Filters);
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    tick(100);
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    flush();
    fixture.detectChanges();
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
    spyOn(projectApi, "filter").and.callFake(params => {
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
              siteIds: new Set([])
            }),
            new Project({
              id: 2,
              name: "Project 2",
              creatorId: 1,
              description: "Description 2",
              siteIds: new Set([])
            }),
            new Project({
              id: 3,
              name: "Project 3",
              creatorId: 1,
              description: "Description 3",
              siteIds: new Set([])
            })
          ]);
        }
      }, 50);

      return subject;
    });

    tick(100);
    fixture.detectChanges();

    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/home.html"
    );
    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    tick(100);
    fixture.detectChanges();

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
