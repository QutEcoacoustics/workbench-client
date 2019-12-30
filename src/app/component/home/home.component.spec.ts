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
import { List } from "immutable";
import { BehaviorSubject, Subject } from "rxjs";
import { delay } from "rxjs/operators";
import { testBawServices } from "src/app/app.helper";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { Card, CardsComponent } from "../shared/cards/cards.component";
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
    spyOn(securityApi, "getLoggedInTrigger").and.callFake(() => {
      return new BehaviorSubject<boolean>(false);
    });
    spyOn(projectApi, "getFilteredProjects").and.callFake(() => {
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
    spyOn(securityApi, "getLoggedInTrigger").and.callFake(() => {
      return new BehaviorSubject<boolean>(false);
    });
    spyOn(projectApi, "getFilteredProjects").and.callFake(() => {
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

  it("should display empty project in list", fakeAsync(() => {
    spyOn(securityApi, "getLoggedInTrigger").and.callFake(() => {
      return new BehaviorSubject<boolean>(false);
    });
    spyOn(projectApi, "getFilteredProjects").and.callFake(() => {
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

    const cards = fixture.nativeElement.querySelectorAll("app-card-image");
    const button = fixture.nativeElement.querySelector("button");

    expect(cards.length).toBe(0);
    expect(button).toBeTruthy();
  }));

  it("should display single project in list", fakeAsync(() => {
    spyOn(securityApi, "getLoggedInTrigger").and.callFake(() => {
      return new BehaviorSubject<boolean>(false);
    });
    spyOn(projectApi, "getFilteredProjects").and.callFake(() => {
      const subject = new Subject<Project[]>();

      subject.pipe(delay(50));
      subject.next([
        new Project({
          id: 1,
          name: "Project",
          creatorId: 1,
          description: "Description",
          siteIds: new Set([])
        })
      ]);

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

  xit("should display three projects in list", () => {
    httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/filter"
    );
    httpMock.expectOne(config.getConfig().environment.cmsRoot + "/home.html");
    fixture.detectChanges();
  });

  xit("should link to project details page", () => {
    httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/projects/filter"
    );
    httpMock.expectOne(config.getConfig().environment.cmsRoot + "/home.html");
    fixture.detectChanges();
  });
});
