import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockMapComponent } from "src/app/component/shared/map/mapMock";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { projectResolvers } from "src/app/services/baw-api/projects.service";
import { siteResolvers } from "src/app/services/baw-api/sites.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { SiteCardComponent } from "../../site-card/site-card.component";
import { DetailsComponent } from "./details.component";

describe("ProjectDetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let defaultProject: Project;
  let defaultSites: Site[];
  let defaultError: ApiErrorDetails;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails,
    sites: Site[],
    sitesError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [MockMapComponent, SiteCardComponent, DetailsComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show,
              sites: siteResolvers.list
            },
            {
              project: {
                model: project,
                error: projectError
              },
              sites: {
                model: sites,
                error: sitesError
              }
            }
          )
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    defaultProject = new Project({
      id: 1,
      name: "Project"
    });
    defaultSites = [];
    defaultError = {
      status: 401,
      message: "Unauthorized"
    };
  });

  it("should create", () => {
    configureTestingModule(defaultProject, undefined, defaultSites, undefined);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("Error Handling", () => {
    it("should handle failed project model", () => {
      configureTestingModule(undefined, defaultError, defaultSites, undefined);
      fixture.detectChanges();

      const body = fixture.nativeElement;
      expect(body.childElementCount).toBe(0);
    });

    it("should handle failed site model", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        undefined,
        defaultError
      );
      fixture.detectChanges();

      const body = fixture.nativeElement;
      expect(body.childElementCount).toBe(0);
    });
  });

  describe("Project", () => {
    it("should display project name", () => {
      const project = new Project({
        id: 1,
        name: "Test project"
      });

      configureTestingModule(project, undefined, defaultSites, undefined);
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h1");
      expect(title).toBeTruthy();
      expect(title.innerText).toBe("Test project");
    });

    it("should display default project image", () => {
      const project = new Project({
        id: 1,
        name: "Test project"
      });

      configureTestingModule(project, undefined, defaultSites, undefined);
      fixture.detectChanges();

      const image = fixture.nativeElement.querySelector("img");
      expect(image).toBeTruthy();
      expect(image.src).toBe(
        `http://${window.location.host}/assets/images/project/project_span4.png`
      );
      expect(image.alt.length).toBeGreaterThan(0);
    });

    it("should display custom project image", () => {
      const project = new Project({
        id: 1,
        name: "Test project",
        imageUrl: "http://brokenlink/"
      });

      configureTestingModule(project, undefined, defaultSites, undefined);
      fixture.detectChanges();

      const image = fixture.nativeElement.querySelector("img");
      expect(image).toBeTruthy();
      expect(image.src).toBe("http://brokenlink/");
      expect(image.alt.length).toBeGreaterThan(0);
    });

    it("should display description", () => {
      const project = new Project({
        id: 1,
        name: "Test project",
        description: "A test project"
      });

      configureTestingModule(project, undefined, defaultSites, undefined);
      fixture.detectChanges();

      const description = fixture.nativeElement.querySelector(
        "p#project_description"
      );
      expect(description).toBeTruthy();
      expect(description.innerText).toBe("A test project");
    });
  });

  describe("Sites", () => {
    it("should display no sites found message", () => {
      configureTestingModule(defaultProject, undefined, [], undefined);
      fixture.detectChanges();

      const sitePlaceholder = fixture.nativeElement.querySelector(
        "p#site_placeholder"
      );
      expect(sitePlaceholder).toBeTruthy();
      expect(sitePlaceholder.innerText).toBe(
        "No sites associated with this project"
      );
    });

    it("should display single site", fakeAsync(() => {
      const site = new Site({
        id: 1,
        name: "Site",
        description: "A sample site"
      });

      configureTestingModule(defaultProject, undefined, [site], undefined);
      fixture.detectChanges();

      const siteEls = fixture.nativeElement.querySelectorAll("app-site-card");
      expect(siteEls.length).toBe(1);
    }));

    it("should display single site with name", fakeAsync(() => {
      const site = new Site({
        id: 1,
        name: "Custom Site",
        description: "A sample site"
      });

      configureTestingModule(defaultProject, undefined, [site], undefined);
      fixture.detectChanges();

      const siteEl = fixture.nativeElement.querySelectorAll("app-site-card")[0];
      const el = siteEl.querySelector("h5");
      expect(el.innerText.trim()).toBe("Custom Site");
    }));

    it("should display multiple sites", fakeAsync(() => {
      const sites = [
        new Site({
          id: 1,
          name: "Site 1",
          description: "A sample site"
        }),
        new Site({
          id: 2,
          name: "Site 2",
          description: "A sample site"
        })
      ];

      configureTestingModule(defaultProject, undefined, sites, undefined);
      fixture.detectChanges();

      const siteEls = fixture.nativeElement.querySelectorAll("app-site-card");
      expect(siteEls.length).toBe(2);
    }));

    it("should display multiple sites in order", fakeAsync(() => {
      const sites = [
        new Site({
          id: 1,
          name: "Site 1",
          description: "A sample site"
        }),
        new Site({
          id: 2,
          name: "Site 2",
          description: "A sample site"
        })
      ];

      configureTestingModule(defaultProject, undefined, sites, undefined);
      fixture.detectChanges();

      const siteEls = fixture.nativeElement.querySelectorAll("app-site-card");

      let el = siteEls[0].querySelector("h5");
      expect(el.innerText.trim()).toBe("Site 1");

      el = siteEls[1].querySelector("h5");
      expect(el.innerText.trim()).toBe("Site 2");
    }));
  });

  describe("Google Maps", () => {
    it("should display google maps placeholder box when no sites found", () => {
      configureTestingModule(defaultProject, undefined, [], undefined);
      fixture.detectChanges();

      const googleMaps = fixture.nativeElement.querySelector("app-map");
      expect(googleMaps).toBeTruthy();
      expect(googleMaps.querySelector("span").innerText).toBe(
        "No locations specified"
      );
    });

    it("should display google maps with pin for single site", () => {
      const site = new Site({
        id: 1,
        name: "Site",
        description: "A sample site",
        locationObfuscated: true,
        customLatitude: 0,
        customLongitude: 1
      });

      configureTestingModule(defaultProject, undefined, [site], undefined);
      fixture.detectChanges();

      const googleMaps = fixture.nativeElement.querySelector("app-map");
      expect(googleMaps).toBeTruthy();
      expect(googleMaps.querySelector("p").innerText).toBe("Lat: 0 Long: 1");
    });

    it("should display google maps with pins for multiple sites", () => {
      const sites = [
        new Site({
          id: 1,
          name: "Site",
          description: "A sample site",
          locationObfuscated: true,
          customLatitude: 0,
          customLongitude: 1
        }),
        new Site({
          id: 2,
          name: "Site",
          description: "A sample site",
          locationObfuscated: true,
          customLatitude: 2,
          customLongitude: 3
        })
      ];

      configureTestingModule(defaultProject, undefined, sites, undefined);
      fixture.detectChanges();

      const googleMaps = fixture.nativeElement.querySelector("app-map");
      const output = googleMaps.querySelectorAll("p");
      expect(googleMaps).toBeTruthy();
      expect(output.length).toBe(2);
      expect(output[0].innerText).toBe("Lat: 0 Long: 1");
      expect(output[1].innerText).toBe("Lat: 2 Long: 3");
    });
  });
});
