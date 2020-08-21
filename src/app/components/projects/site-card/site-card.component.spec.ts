import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { assertImage } from "@test/helpers/html";
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
  });

  it("should create", () => {
    component.project = new Project(generateProject());
    component.site = new Site(generateSite());

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display site name", () => {
    component.project = new Project(generateProject());
    component.site = new Site({ ...generateSite(), name: "Test Site" });
    fixture.detectChanges();

    const name = fixture.nativeElement.querySelector("h5#name");
    expect(name).toBeTruthy();
    expect(name.innerText).toContain("Test Site");
  });

  it("should navigate user to site when clicking site name", fakeAsync(() => {
    component.project = new Project({ ...generateProject(), id: 2 });
    component.site = new Site({ ...generateSite(), id: 5 });
    fixture.detectChanges();

    const nameHyperlink = fixture.nativeElement.querySelector("#imageLink");
    expect(nameHyperlink).toBeTruthy();
    expect(nameHyperlink.getAttribute("href")).toBe("/projects/2/sites/5");
  }));

  it("should display site image", () => {
    component.project = new Project(generateProject());
    component.site = new Site({
      ...generateSite(),
      name: "Test Site",
      imageUrl: undefined,
    });
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector("img#image");
    assertImage(
      image,
      `${websiteHttpUrl}/assets/images/site/site_span4.png`,
      "Test Site alt"
    );
  });

  it("should navigate user to site when clicking site image", () => {
    component.project = new Project({ ...generateProject(), id: 2 });
    component.site = new Site({ ...generateSite(), id: 5 });
    fixture.detectChanges();

    const imgHyperlink = fixture.nativeElement.querySelector("#imageLink");
    expect(imgHyperlink).toBeTruthy();
    expect(imgHyperlink.getAttribute("href")).toBe("/projects/2/sites/5");
  });

  it("should display custom site image", () => {
    component.project = new Project(generateProject());
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
    component.project = new Project({ ...generateProject(), id: 2 });
    component.site = new Site({ ...generateSite(), id: 5 });
    fixture.detectChanges();

    const imgHyperlink = fixture.nativeElement.querySelector("#imageLink");
    expect(imgHyperlink).toBeTruthy();
    expect(imgHyperlink.getAttribute("href")).toBe("/projects/2/sites/5");
  });

  it("should display details button", () => {
    component.project = new Project(generateProject());
    component.site = new Site(generateSite());
    fixture.detectChanges();

    const displayButton = fixture.nativeElement.querySelector("a#details");
    expect(displayButton).toBeTruthy();
    expect(displayButton.innerText.trim()).toBe("Details");
  });

  it("should navigate user to site when clicking details button", () => {
    component.project = new Project({ ...generateProject(), id: 2 });
    component.site = new Site({ ...generateSite(), id: 5 });
    fixture.detectChanges();

    const displayButton = fixture.nativeElement.querySelector("a#details");
    expect(displayButton).toBeTruthy();
    expect(displayButton.getAttribute("href")).toBe("/projects/2/sites/5");
  });

  it("should display play button", () => {
    component.project = new Project(generateProject());
    component.site = new Site(generateSite());
    fixture.detectChanges();

    const playButton = fixture.nativeElement.querySelector("a#play");
    expect(playButton).toBeTruthy();
    expect(playButton.innerText.trim()).toBe("Play");
  });

  xit("should navigate user to listen page when clicking play button", () => {});

  it("should display visualise button", () => {
    component.project = new Project(generateProject());
    component.site = new Site(generateSite());
    fixture.detectChanges();

    const visualizeButton = fixture.nativeElement.querySelector("a#visualize");
    expect(visualizeButton).toBeTruthy();
    expect(visualizeButton.innerText.trim()).toBe("Visualise");
  });

  xit("should navigate user to visualizer page when clicking play button", () => {});
});
