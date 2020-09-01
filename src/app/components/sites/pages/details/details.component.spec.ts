import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GoogleMapsModule } from "@angular/google-maps";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { SharedModule } from "@components/shared/shared.module";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { MockMapComponent } from "@shared/map/mapMock.component";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { assertImage } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { DetailsComponent } from "./details.component";

describe("SitesDetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let defaultProject: Project;
  let defaultSite: Site;

  function configureTestingModule(
    project: Project,
    projectError: ApiErrorDetails,
    site: Site,
    siteError: ApiErrorDetails
  ) {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        GoogleMapsModule,
        MockBawApiModule,
      ],
      declarations: [DetailsComponent, MockMapComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              project: projectResolvers.show,
              site: siteResolvers.show,
            },
            {
              project: { model: project, error: projectError },
              site: { model: site, error: siteError },
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
    defaultSite = new Site(generateSite());
  });

  it("should create", () => {
    configureTestingModule(defaultProject, undefined, defaultSite, undefined);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("Error Handling", () => {
    it("should handle failed project model", () => {
      configureTestingModule(
        undefined,
        generateApiErrorDetails(),
        defaultSite,
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
        ...generateSite(),
        name: "Custom Project",
      });
      configureTestingModule(project, undefined, defaultSite, undefined);
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h1");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain("Project: Custom Project");
    });
  });

  describe("Site", () => {
    it("should display site name", () => {
      const site = new Site({
        ...generateSite(),
        name: "Custom Site",
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      fixture.detectChanges();

      const title = fixture.nativeElement.querySelector("h1");
      expect(title).toBeTruthy();
      expect(title.innerText).toContain("Custom Site");
    });

    it("should display default site image", () => {
      const site = new Site({
        ...generateSite(),
        name: "Site",
        imageUrl: undefined,
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      fixture.detectChanges();

      const image = fixture.nativeElement.querySelector("img");
      assertImage(
        image,
        `http://${window.location.host}/assets/images/site/site_span4.png`,
        "Site image"
      );
    });

    it("should display custom site image", () => {
      const site = new Site({
        ...generateSite(),
        name: "Site",
        imageUrl: "http://brokenlink/",
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      fixture.detectChanges();

      const image = fixture.nativeElement.querySelector("img");
      assertImage(image, "http://brokenlink/", "Site image");
    });

    it("should display site description with html markup", () => {
      const site = new Site({
        ...generateSite(),
        descriptionHtml: "<b>Custom Description<b>",
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      fixture.detectChanges();

      const description = fixture.nativeElement.querySelector(
        "p#site_description"
      );
      expect(description).toBeTruthy();
      expect(description.innerHTML).toContain("<b>Custom Description<b>");
    });
  });

  describe("Google Maps", () => {
    it("should display google maps placeholder box when no location found", () => {
      const site = new Site({
        id: 1,
        name: "Site",
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      fixture.detectChanges();

      const googleMaps = fixture.nativeElement.querySelector("baw-map");
      expect(googleMaps).toBeTruthy();
      expect(googleMaps.querySelector("span").innerText).toContain(
        "No locations specified"
      );
    });

    it("should display google maps with pin when location found", () => {
      const site = new Site({
        id: 1,
        name: "Site",
        locationObfuscated: true,
        customLatitude: 0,
        customLongitude: 1,
      });
      configureTestingModule(defaultProject, undefined, site, undefined);
      fixture.detectChanges();

      const googleMaps = fixture.nativeElement.querySelector("baw-map");
      expect(googleMaps).toBeTruthy();
      expect(googleMaps.querySelector("p").innerText).toContain(
        "Lat: 0 Long: 1"
      );
    });
  });
});
