import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { SharedModule } from "../../shared/shared.module";
import { SiteCardComponent } from "./site-card.component";

describe("SiteCardComponent", () => {
  let component: SiteCardComponent;
  let fixture: ComponentFixture<SiteCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [SiteCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteCardComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.project = new Project({
      id: 1,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 1,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display site name", () => {
    component.project = new Project({
      id: 1,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 1,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });

    fixture.detectChanges();

    const name = fixture.nativeElement.querySelector("h5#name");
    expect(name).toBeTruthy();
    expect(name.innerText).toContain("Test Site");
  });

  it("should navigate user to site when clicking site name", fakeAsync(() => {
    component.project = new Project({
      id: 2,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 5,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });

    fixture.detectChanges();

    const nameHyperlink = fixture.nativeElement.querySelector("#imageLink");
    expect(nameHyperlink).toBeTruthy();
    expect(nameHyperlink.getAttribute("href")).toBe("/projects/2/sites/5");
  }));

  it("should display site image", () => {
    component.project = new Project({
      id: 1,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 1,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });

    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector("img#image");
    expect(image).toBeTruthy();
    expect(image.src).toBe(
      `http://${window.location.host}/assets/images/site/site_span4.png`
    );
    expect(image.alt).toBe("Test Site alt");
  });

  it("should navigate user to site when clicking site image", () => {
    component.project = new Project({
      id: 2,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 5,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });

    fixture.detectChanges();

    const imgHyperlink = fixture.nativeElement.querySelector("#imageLink");
    expect(imgHyperlink).toBeTruthy();
    expect(imgHyperlink.getAttribute("href")).toBe("/projects/2/sites/5");
  });

  it("should display custom site image", () => {
    component.project = new Project({
      id: 1,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 1,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0,
      imageUrl: "http://brokenlink/"
    });

    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector("img");
    expect(image).toBeTruthy();
    expect(image.src).toBe("http://brokenlink/");
    expect(image.alt).toBe("Test Site alt");
  });

  it("should navigate user to site when clicking custom site image", () => {
    component.project = new Project({
      id: 2,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 5,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0,
      imageUrl: "http://brokenlink/"
    });

    fixture.detectChanges();

    const imgHyperlink = fixture.nativeElement.querySelector("#imageLink");
    expect(imgHyperlink).toBeTruthy();
    expect(imgHyperlink.getAttribute("href")).toBe("/projects/2/sites/5");
  });

  it("should display details button", () => {
    component.project = new Project({
      id: 1,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 1,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });

    fixture.detectChanges();

    const displayButton = fixture.nativeElement.querySelector("a#details");
    expect(displayButton).toBeTruthy();
    expect(displayButton.innerText.trim()).toBe("Details");
  });

  it("should navigate user to site when clicking details button", () => {
    component.project = new Project({
      id: 2,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 5,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });

    fixture.detectChanges();

    const displayButton = fixture.nativeElement.querySelector("a#details");
    expect(displayButton).toBeTruthy();
    expect(displayButton.getAttribute("href")).toBe("/projects/2/sites/5");
  });

  it("should display play button", () => {
    component.project = new Project({
      id: 1,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 1,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });

    fixture.detectChanges();

    const playButton = fixture.nativeElement.querySelector("a#play");
    expect(playButton).toBeTruthy();
    expect(playButton.innerText.trim()).toBe("Play");
  });

  xit("should navigate user to listen page when clicking play button", () => {});

  it("should display visualise button", () => {
    component.project = new Project({
      id: 1,
      name: "Test project",
      description: "A test project",
      creatorId: 1,
      siteIds: new Set([])
    });
    component.site = new Site({
      id: 1,
      name: "Test Site",
      creatorId: 1,
      description: "A sample site",
      projectIds: new Set([1, 2, 3]),
      locationObfuscated: true,
      customLatitude: 0,
      customLongitude: 0
    });

    fixture.detectChanges();

    const visualizeButton = fixture.nativeElement.querySelector("a#visualize");
    expect(visualizeButton).toBeTruthy();
    expect(visualizeButton.innerText.trim()).toBe("Visualise");
  });

  xit("should navigate user to visualizer page when clicking play button", () => {});
});
