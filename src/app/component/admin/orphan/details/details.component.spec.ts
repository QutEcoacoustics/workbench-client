import { Injector } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ACCOUNT, PROJECT } from "@baw-api/ServiceTokens";
import { shallowSiteResolvers } from "@baw-api/site/sites.service";
import { AdminAudioRecordingComponent } from "@component/admin/audio-recordings/details/details.component";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { humanizeDateTime } from "@shared/detail-view/render-field/render-field.component";
import { SharedModule } from "@shared/shared.module";
import { assertDetailView } from "@test/helpers/detail-view";
import { mockActivatedRoute, testBawServices } from "@test/helpers/testbed";
import { DateTime } from "luxon";
import { BehaviorSubject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminOrphanComponent } from "./details.component";

describe("AdminOrphanComponent", () => {
  let component: AdminOrphanComponent;
  let fixture: ComponentFixture<AdminOrphanComponent>;
  let injector: Injector;

  function configureTestingModule(model: Site, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [AdminAudioRecordingComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { site: shallowSiteResolvers.show },
            { site: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrphanComponent);
    injector = TestBed.inject(Injector);
    const accountsApi = TestBed.inject(ACCOUNT.token);
    const projectsApi = TestBed.inject(PROJECT.token);
    component = fixture.componentInstance;

    spyOn(accountsApi, "show").and.callFake(() => {
      return new BehaviorSubject<User>(
        new User({ id: 1, userName: "custom username" })
      );
    });

    spyOn(projectsApi, "filter").and.callFake(() => {
      return new BehaviorSubject<Project[]>([
        new Project({ id: 1, siteIds: [1], name: "custom project" }),
      ]);
    });

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }

    fixture.detectChanges();
  }

  it("should create", () => {
    configureTestingModule(
      new Site({
        id: 1,
      })
    );
    expect(component).toBeTruthy();
  });

  it("should handle error", () => {
    configureTestingModule(undefined, {
      status: 401,
      message: "Unauthorized",
    } as ApiErrorDetails);
    expect(component).toBeTruthy();
  });

  describe("details", () => {
    const createdAt = DateTime.fromISO("2010-02-01T21:00:00.000+15:00", {
      setZone: true,
    });
    const updatedAt = DateTime.fromISO("2010-03-01T21:00:00.000+15:00", {
      setZone: true,
    });

    beforeEach(function () {
      const model = new Site({
        id: 1,
        name: "custom site",
        imageUrl: "/customImage.png",
        description: "custom description",
        locationObfuscated: true,
        creatorId: 1,
        updaterId: 1,
        createdAt: createdAt.toISO(),
        updatedAt: updatedAt.toISO(),
        projectIds: [1],
        customLatitude: 100,
        customLongitude: 101,
        timezoneInformation: {
          identifierAlt: "Paris",
          identifier: "Europe/Paris",
          friendlyIdentifier: "Europe - Paris",
          utcOffset: 3600,
          utcTotalOffset: 7200,
        },
      });

      configureTestingModule(model);
      this.fixture = fixture;
    });

    assertDetailView("Site Id", "id", "1");
    assertDetailView("Site Name", "name", "custom site");
    assertDetailView("Description", "description", "custom description");
    assertDetailView("Location Obfuscated", "locationObfuscated", true);
    assertDetailView("Latitude", "customLatitude", "100");
    assertDetailView("Longitude", "customLongitude", "101");
    assertDetailView("Image", "imageUrl", "/customImage.png");
    assertDetailView("Creator", "creatorId", "User: custom username (1)");
    assertDetailView("Updater", "updaterId", "User: custom username (1)");
    assertDetailView("Created At", "createdAt", humanizeDateTime(createdAt));
    assertDetailView("Updated At", "updatedAt", humanizeDateTime(updatedAt));
    assertDetailView("Projects", "projects", "Project: custom project (1)");
    assertDetailView(
      "Time Zone",
      "timezoneInformation",
      '{"identifierAlt":"Paris","identifier":"Europe/Paris","friendlyIdentifier":"Europe - Paris","utcOffset":3600,"utcTotalOffset":7200}'
    );
  });
});
