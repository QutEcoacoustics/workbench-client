import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { assetRoot } from "@services/app-config/app-config.service";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { assertImage, assertRoute } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { SiteCardComponent } from "./site-card.component";

describe("SiteCardComponent", () => {
  let component: SiteCardComponent;
  let fixture: ComponentFixture<SiteCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, MockBawApiModule],
      declarations: [SiteCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteCardComponent);
    component = fixture.componentInstance;
    component.project = new Project(generateProject());
    component.site = new Site(generateSite());
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display site name", () => {
    component.site = new Site({ ...generateSite(), name: "Test Site" });
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector("h5#name");
    expect(name).toBeTruthy();
    expect(name.innerText).toContain("Test Site");
  });

  it("should navigate user to site when clicking site name", () => {
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector("#nameLink");
    assertRoute(name, component.site.getViewUrl(component.project));
  });

  it("should display site image", () => {
    component.site = new Site({
      ...generateSite(),
      name: "Test Site",
      imageUrl: undefined,
    });
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector("img#image");
    assertImage(
      image,
      `${websiteHttpUrl}${assetRoot}/images/site/site_span4.png`,
      "Test Site alt"
    );
  });

  it("should navigate user to site when clicking site image", () => {
    fixture.detectChanges();
    const image = fixture.nativeElement.querySelector("#imageLink");
    assertRoute(image, component.site.getViewUrl(component.project));
  });

  it("should display custom site image", () => {
    component.site = new Site({
      ...generateSite(),
      name: "Test Site",
      imageUrl: "http://brokenlink/",
    });
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector("img");
    assertImage(image, "http://brokenlink/", "Test Site alt");
  });

  it("should navigate user to site when clicking custom site image", () => {
    fixture.detectChanges();
    const image = fixture.nativeElement.querySelector("#imageLink");
    assertRoute(image, component.site.getViewUrl(component.project));
  });

  it("should display details button", () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("a#details");
    expect(button).toBeTruthy();
    expect(button.innerText.trim()).toBe("Details");
  });

  it("should navigate user to site when clicking details button", () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("a#details");
    assertRoute(button, component.site.getViewUrl(component.project));
  });

  it("should display play button", () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("a#play");
    expect(button).toBeTruthy();
    expect(button.innerText.trim()).toBe("Play");
  });

  xit("should navigate user to listen page when clicking play button", () => {});

  it("should display visualise button", () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("a#visualize");
    expect(button).toBeTruthy();
    expect(button.innerText.trim()).toBe("Visualise");
  });

  xit("should navigate user to visualizer page when clicking play button", () => {});
});
