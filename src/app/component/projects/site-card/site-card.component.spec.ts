import { ComponentFixture, TestBed } from "@angular/core/testing";
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
});
