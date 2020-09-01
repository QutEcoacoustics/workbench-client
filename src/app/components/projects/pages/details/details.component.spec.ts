import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { SiteCardComponent } from "@components/projects/site-card/site-card.component";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { assetRoot } from "@services/app-config/app-config.service";
import { MockMapComponent } from "@shared/map/mapMock.component";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { assertImage } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { websiteHttpUrl } from "@test/helpers/url";
import { DetailsComponent } from "./details.component";

describe("ProjectDetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let defaultProject: Project;
  let defaultSites: Site[];

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails,
    sites: Site[],
    sitesError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, MockBawApiModule],
      declarations: [MockMapComponent, SiteCardComponent, DetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show,
              sites: siteResolvers.list,
            },
            {
              project: { model: project, error: projectError },
              sites: { model: sites, error: sitesError },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultSites = [];
  });

  it("should create", () => {
    configureTestingModule(defaultProject, undefined, defaultSites, undefined);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("Error Handling", () => {
    it("should handle failed project model", () => {
      configureTestingModule(
        undefined,
        generateApiErrorDetails(),
        defaultSites,
        undefined
      );
      fixture.detectChanges();

      const body = fixture.nativeElement;
      expect(body.childElementCount).toBe(0);
    });

    it("should handle failed site model", () => {
      configureTestingModule(
        defaultProject,
        undefined,
        undefined,
        generateApiErrorDetails()
      );
      fixture.detectChanges();

      const body = fixture.nativeElement;
      expect(body.childElementCount).toBe(0);
    });
  });

  describe("Project", () => {
    it("should display project name", () => {
      const project = new Project({
        ...generateProject(),
        name: "Test Project",
      });

      configureTestingModule(project, undefined, defaultSites, undefined);
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h1");
      expect(title).toBeTruthy();
      expect(title.innerText).toBe("Test Project");
    });

    it("should display default project image", () => {
      const project = new Project({
        ...generateProject(),
        name: "Test Project",
        imageUrl: undefined,
      });

      configureTestingModule(project, undefined, defaultSites, undefined);
      fixture.detectChanges();

      const image = fixture.nativeElement.querySelector("img");
      assertImage(
        image,
        `${websiteHttpUrl}${assetRoot}/images/project/project_span4.png`,
        "Test Project image"
      );
    });

    it("should display custom project image", () => {
      const project = new Project({
        ...generateProject(),
        name: "Test Project",
        imageUrl: "http://brokenlink/",
      });

      configureTestingModule(project, undefined, defaultSites, undefined);
      fixture.detectChanges();

      const image = fixture.nativeElement.querySelector("img");
      assertImage(image, "http://brokenlink/", "Test Project image");
    });

    it("should display description", () => {
      const project = new Project({
        ...generateProject(),
        description: "A test project",
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
      const site = new Site(generateSite());

      configureTestingModule(defaultProject, undefined, [site], undefined);
      fixture.detectChanges();

      const siteEls = fixture.nativeElement.querySelectorAll("app-site-card");
      expect(siteEls.length).toBe(1);
    }));

    it("should display single site with name", fakeAsync(() => {
      const site = new Site({ ...generateSite(), name: "Custom Site" });

      configureTestingModule(defaultProject, undefined, [site], undefined);
      fixture.detectChanges();

      const siteEl = fixture.nativeElement.querySelectorAll("app-site-card")[0];
      const el = siteEl.querySelector("h5");
      expect(el.innerText.trim()).toBe("Custom Site");
    }));

    it("should display multiple sites", fakeAsync(() => {
      const sites = [new Site(generateSite()), new Site(generateSite())];

      configureTestingModule(defaultProject, undefined, sites, undefined);
      fixture.detectChanges();

      const siteEls = fixture.nativeElement.querySelectorAll("app-site-card");
      expect(siteEls.length).toBe(2);
    }));

    it("should display multiple sites in order", fakeAsync(() => {
      const sites = [
        new Site({ ...generateSite(1), name: "Site 1" }),
        new Site({ ...generateSite(2), name: "Site 2" }),
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

      const googleMaps = fixture.nativeElement.querySelector("baw-map");
      expect(googleMaps).toBeTruthy();
      expect(googleMaps.querySelector("span").innerText).toBe(
        "No locations specified"
      );
    });

    it("should display google maps with pin for single site", () => {
      const site = new Site(generateSite());

      configureTestingModule(defaultProject, undefined, [site], undefined);
      fixture.detectChanges();

      const googleMaps = fixture.nativeElement.querySelector("baw-map");
      expect(googleMaps).toBeTruthy();
      expect(googleMaps.querySelector("p").innerText).toBe(
        `Lat: ${site.getLatitude()} Long: ${site.getLongitude()}`
      );
    });

    it("should display google maps with pins for multiple sites", () => {
      const sites = [new Site(generateSite()), new Site(generateSite())];

      configureTestingModule(defaultProject, undefined, sites, undefined);
      fixture.detectChanges();

      const googleMaps = fixture.nativeElement.querySelector("baw-map");
      const output = googleMaps.querySelectorAll("p");
      expect(googleMaps).toBeTruthy();
      expect(output.length).toBe(2);
      expect(output[0].innerText).toBe(
        `Lat: ${sites[0].getLatitude()} Long: ${sites[0].getLongitude()}`
      );
      expect(output[1].innerText).toBe(
        `Lat: ${sites[1].getLatitude()} Long: ${sites[1].getLongitude()}`
      );
    });
  });
});
