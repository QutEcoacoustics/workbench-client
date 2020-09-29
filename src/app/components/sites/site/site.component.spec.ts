import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GoogleMapsModule } from "@angular/google-maps";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@components/shared/shared.module";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { assetRoot } from "@services/app-config/app-config.service";
import { MockMapComponent } from "@shared/map/mapMock.component";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { assertImage } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { SiteComponent } from "./site.component";

describe("SitesDetailsComponent", () => {
  let component: SiteComponent;
  let fixture: ComponentFixture<SiteComponent>;
  let defaultProject: Project;
  let defaultSite: Site;

  function configureTestingModule(project: Project, site: Site) {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        GoogleMapsModule,
        MockBawApiModule,
      ],
      declarations: [SiteComponent, MockMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteComponent);
    component = fixture.componentInstance;
    component.project = project;
    component.site = site;
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultSite = new Site(generateSite());
  });

  it("should create", () => {
    configureTestingModule(defaultProject, defaultSite);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("Project", () => {
    it("should display project name", () => {
      const project = new Project({
        ...generateSite(),
        name: "Custom Project",
      });
      configureTestingModule(project, defaultSite);
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
      configureTestingModule(defaultProject, site);
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
      configureTestingModule(defaultProject, site);
      fixture.detectChanges();

      const image = fixture.nativeElement.querySelector("img");
      assertImage(
        image,
        `${websiteHttpUrl}${assetRoot}/images/site/site_span4.png`,
        "Site image"
      );
    });

    it("should display custom site image", () => {
      const site = new Site({
        ...generateSite(),
        name: "Site",
        imageUrl: "http://brokenlink/",
      });
      configureTestingModule(defaultProject, site);
      fixture.detectChanges();

      const image = fixture.nativeElement.querySelector("img");
      assertImage(image, "http://brokenlink/", "Site image");
    });

    it("should display site description with html markup", () => {
      const site = new Site({
        ...generateSite(),
        descriptionHtml: "<b>Custom Description<b>",
      });
      configureTestingModule(defaultProject, site);
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
      configureTestingModule(defaultProject, site);
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
      configureTestingModule(defaultProject, site);
      fixture.detectChanges();

      const googleMaps = fixture.nativeElement.querySelector("baw-map");
      expect(googleMaps).toBeTruthy();
      expect(googleMaps.querySelector("p").innerText).toContain(
        "Lat: 0 Long: 1"
      );
    });
  });
});
