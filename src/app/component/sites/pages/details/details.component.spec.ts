import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { testBawServices } from "src/app/app.helper";
import { MockMapComponent } from "src/app/component/shared/map/mapMock";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { DetailsComponent } from "./details.component";

describe("SitesDetailsComponent", () => {
  let projectsApi: ProjectsService;
  let sitesApi: SitesService;
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, AgmSnazzyInfoWindowModule],
      declarations: [DetailsComponent, MockMapComponent],
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
    expect(title.innerText).toContain("Loading");
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
        status: 404,
        message: "Project Not Found"
      } as APIErrorDetails);
      return subject;
    });

    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Not found");
  });

  it("should handle unauthorized project", () => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();
      subject.error({
        status: 401,
        message: "Unauthorized"
      } as APIErrorDetails);
      return subject;
    });

    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Unauthorized access");
  });

  it("should handle site not found", () => {
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();
      subject.error({
        status: 404,
        message: "Project Not Found"
      } as APIErrorDetails);
      return subject;
    });

    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Not found");
  });

  it("should handle unauthorized site", () => {
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();
      subject.error({
        status: 401,
        message: "Unauthorized"
      } as APIErrorDetails);
      return subject;
    });

    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Unauthorized access");
  });

  it("should show project error instead of site error when project loads first", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();
      subject.error({
        status: 401,
        message: "Unauthorized"
      } as APIErrorDetails);
      return subject;
    });
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();
      setTimeout(() => {
        subject.error({
          status: 404,
          message: "Site Not Found"
        } as APIErrorDetails);
      }, 50);
      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Unauthorized access");
  }));

  it("should show project error instead of site error when site loads first", fakeAsync(() => {
    spyOn(projectsApi, "getProject").and.callFake(() => {
      const subject = new Subject<Project>();
      setTimeout(() => {
        subject.error({
          status: 401,
          message: "Unauthorized"
        } as APIErrorDetails);
      }, 50);
      return subject;
    });
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();
      subject.error({
        status: 404,
        message: "Site Not Found"
      } as APIErrorDetails);
      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Unauthorized access");
  }));

  it("should show loading until project returns", fakeAsync(() => {
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
      }, 1000);

      return subject;
    });
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 0
          })
        );
      }, 50);

      return subject;
    });

    // Only return sites
    fixture.detectChanges();
    tick(50);
    fixture.detectChanges();
    const loading = fixture.debugElement.nativeElement.querySelector("h4");
    expect(loading).toBeTruthy();
    expect(loading.innerText).toContain("Loading");

    // Return project data
    flush();
    fixture.detectChanges();
    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Test Site");
    expect(title.querySelector("small").innerText).toContain(
      "Project: Test project"
    );
  }));

  it("should show loading until site returns", fakeAsync(() => {
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
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 0
          })
        );
      }, 1000);

      return subject;
    });

    // Only return sites
    fixture.detectChanges();
    tick(50);
    fixture.detectChanges();
    const loading = fixture.debugElement.nativeElement.querySelector("h4");
    expect(loading).toBeTruthy();
    expect(loading.innerText).toContain("Loading");

    // Return project data
    flush();
    fixture.detectChanges();
    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Test Site");
    expect(title.querySelector("small").innerText).toContain(
      "Project: Test project"
    );
  }));

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
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 0
          })
        );
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Project: Test project");
  }));

  it("should display site name", fakeAsync(() => {
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
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 0
          })
        );
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toContain("Test Site");
  }));

  it("should display default site image", fakeAsync(() => {
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
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 0
          })
        );
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const image = fixture.debugElement.nativeElement.querySelector("img");
    expect(image).toBeTruthy();
    expect(image.src).toBe(
      `http://${window.location.host}/assets/images/site/site_span4.png`
    );
    expect(image.alt.length).toBeGreaterThan(0);
  }));

  it("should display custom site image", fakeAsync(() => {
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
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 0,
            imageUrl: "http://brokenlink/"
          })
        );
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

  it("should display description", fakeAsync(() => {
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
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 0
          })
        );
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const description = fixture.debugElement.nativeElement.querySelector(
      "p#site_description"
    );
    expect(description).toBeTruthy();
    expect(description.innerText).toContain("A sample site");
  }));

  it("should display google maps placeholder box when no location found", fakeAsync(() => {
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
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: false
          })
        );
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
    expect(googleMaps.querySelector("span").innerText).toContain(
      "No locations specified"
    );
  }));

  it("should display google maps with pin when location found", fakeAsync(() => {
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
    spyOn(sitesApi, "getProjectSite").and.callFake(() => {
      const subject = new Subject<Site>();

      setTimeout(() => {
        subject.next(
          new Site({
            id: 1,
            name: "Test Site",
            creatorId: 1,
            description: "A sample site",
            projectIds: new Set([1, 2, 3]),
            locationObfuscated: true,
            customLatitude: 0,
            customLongitude: 1
          })
        );
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
    expect(googleMaps.querySelector("p").innerText).toContain("Lat: 0 Long: 1");
  }));
});
