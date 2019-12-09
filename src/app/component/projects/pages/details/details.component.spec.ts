import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { testBawServices } from "src/app/app.helper";
import { MockMapComponent } from "src/app/component/shared/map/mapMock";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { SiteCardComponent } from "../../site-card/site-card.component";
import { DetailsComponent } from "./details.component";

describe("ProjectDetailsComponent", () => {
  let projectsApi: ProjectsService;
  let sitesApi: SitesService;
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [MockMapComponent, SiteCardComponent, DetailsComponent],
      providers: [...testBawServices]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    projectsApi = TestBed.get(ProjectsService);
    sitesApi = TestBed.get(SitesService);

    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should initially display loading title", () => {
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h4");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Loading");
  });

  it("should initially display loading animation", () => {
    fixture.detectChanges();

    const spinner = fixture.debugElement.nativeElement.querySelector(
      "mat-spinner"
    );
    expect(spinner).toBeTruthy();
  });

  it("should handle project not found", () => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();
      subject.error({
        status: projectsApi.apiReturnCodes.notFound,
        message: "Project Not Found"
      });
      return subject;
    });

    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Not found");
  });

  it("should handle unauthorized project", () => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();
      subject.error({
        status: projectsApi.apiReturnCodes.unauthorized,
        message: "Unauthorized"
      });
      return subject;
    });

    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Unauthorized Access");
  });

  it("should display project name", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Test project",
            description: "A test project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Test project");
  }));

  it("should display default project image", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Test project",
            description: "A test project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const image = fixture.debugElement.nativeElement.querySelector("img");
    expect(image).toBeTruthy();
    expect(image.src).toBe(
      `http://${window.location.host}/assets/images/project/project_span4.png`
    );
    expect(image.alt.length).toBeGreaterThan(0);
  }));

  it("should display custom project image", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Test project",
            description: "A test project",
            creatorId: 1,
            siteIds: new Set([]),
            imageUrl: "http://brokenlink/"
          })
        );
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const image = fixture.debugElement.nativeElement.querySelector("img");
    expect(image).toBeTruthy();
    expect(image.src).toBe("http://brokenlink/");
    expect(image.alt.length).toBeGreaterThan(0);
  }));

  it("should display custom description", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Test project",
            description: "A test project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const description = fixture.debugElement.nativeElement.querySelector(
      "p#project_description"
    );
    expect(description).toBeTruthy();
    expect(description.innerText).toBe("A test project");
  }));

  it("should display no sites found message", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Test project",
            description: "A test project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const sitePlaceholder = fixture.debugElement.nativeElement.querySelector(
      "p#site_placeholder"
    );
    expect(sitePlaceholder).toBeTruthy();
    expect(sitePlaceholder.innerText).toBe(
      "No sites associated with this project"
    );
  }));

  it("should display single site", fakeAsync(() => {
    const site = new Site({
      id: 1,
      name: "Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });
    const project = new Project({
      id: 1,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([1])
    });
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(project);
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([site]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const siteCardFixture = TestBed.createComponent(SiteCardComponent);
    const siteCardComponent = siteCardFixture.componentInstance;
    siteCardComponent.site = site;
    siteCardComponent.project = project;
    siteCardFixture.detectChanges();

    const sites = fixture.debugElement.nativeElement.querySelectorAll(
      "app-site-card"
    );
    expect(sites.length).toBe(1);
    expect(sites[0].innerHTML).toEqual(
      siteCardFixture.debugElement.nativeElement.innerHTML
    );
  }));

  it("should display multiple sites", fakeAsync(() => {
    const site1 = new Site({
      id: 1,
      name: "Site #1",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });
    const site2 = new Site({
      id: 2,
      name: "Site #2",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });
    const project = new Project({
      id: 1,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([1, 2])
    });
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(project);
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([site1, site2]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const siteCard1Fixture = TestBed.createComponent(SiteCardComponent);
    const siteCard1Component = siteCard1Fixture.componentInstance;
    siteCard1Component.site = site1;
    siteCard1Component.project = project;
    siteCard1Fixture.detectChanges();

    const siteCard2Fixture = TestBed.createComponent(SiteCardComponent);
    const siteCard2Component = siteCard2Fixture.componentInstance;
    siteCard2Component.site = site2;
    siteCard2Component.project = project;
    siteCard2Fixture.detectChanges();

    const sites = fixture.debugElement.nativeElement.querySelectorAll(
      "app-site-card"
    );
    expect(sites.length).toBe(2);
    expect(sites[0].innerHTML).toEqual(
      siteCard1Fixture.debugElement.nativeElement.innerHTML
    );
    expect(sites[1].innerHTML).toEqual(
      siteCard2Fixture.debugElement.nativeElement.innerHTML
    );
  }));

  it("should display google maps placeholder box when no sites found", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Test project",
            description: "A test project",
            creatorId: 1,
            siteIds: new Set([])
          })
        );
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const googleMaps = fixture.debugElement.nativeElement.querySelector(
      "app-map"
    );
    expect(googleMaps).toBeTruthy();
    expect(googleMaps.querySelector("span").innerText).toBe(
      "No locations specified"
    );
  }));

  it("should display google maps with pin for single site", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Test project",
            description: "A test project",
            creatorId: 1,
            siteIds: new Set([1])
          })
        );
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 1
          })
        ]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const googleMaps = fixture.debugElement.nativeElement.querySelector(
      "app-map"
    );
    expect(googleMaps).toBeTruthy();
    expect(googleMaps.querySelector("p").innerText).toBe("Lat: 0 Long: 1");
  }));

  it("should display google maps with pins for multiple sites", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();

      setTimeout(() => {
        subject.next(
          new Project({
            id: 1,
            name: "Test project",
            description: "A test project",
            creatorId: 1,
            siteIds: new Set([1, 2])
          })
        );
      }, 50);

      return subject;
    });
    spyOn(sitesApi, "getProjectSites").and.callFake(() => {
      const subject = new Subject<Site[]>();

      setTimeout(() => {
        subject.next([
          new Site({
            id: 1,
            name: "Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 1
          }),
          new Site({
            id: 2,
            name: "Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 2,
            customLongitude: 3
          })
        ]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const googleMaps = fixture.debugElement.nativeElement.querySelector(
      "app-map"
    );
    const output = googleMaps.querySelectorAll("p");
    expect(googleMaps).toBeTruthy();
    expect(output.length).toBe(2);
    expect(output[0].innerText).toBe("Lat: 0 Long: 1");
    expect(output[1].innerText).toBe("Lat: 2 Long: 3");
  }));
});

xdescribe("ProjectDetailsComponent Menu", () => {
  xit("should display projects link in menu", () => {});

  xit("should display indented project link in menu", () => {});
});

xdescribe("ProjectDetailsComponent Action Menu", () => {
  xit("should display explore audio action", () => {});

  xit("should not display explore audio action when project not found", () => {});

  xit("should not display explore audio action when unauthorized", () => {});

  xit("should display edit project action", () => {});

  xit("should not display edit project action when project not found", () => {});

  xit("should not display edit project action when unauthorized", () => {});

  xit("should display edit permissions action", () => {});

  xit("should not display edit permissions action when project not found", () => {});

  xit("should not display edit permissions action when unauthorized", () => {});

  xit("should display new site action", () => {});

  xit("should not display new site action when project not found", () => {});

  xit("should not display new site action when unauthorized", () => {});

  xit("should display placeholder created by user details", () => {});

  xit("should display created by user details", () => {});

  xit("should display placeholder modified by user details", () => {});

  xit("should display modified by user details", () => {});

  xit("should display placeholder owned by user details", () => {});

  xit("should display owned by user details", () => {});

  xit("should display access level", () => {});
});
