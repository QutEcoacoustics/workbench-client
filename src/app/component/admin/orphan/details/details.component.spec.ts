import { Injector } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ACCOUNT, PROJECT } from "@baw-api/ServiceTokens";
import { shallowSiteResolvers } from "@baw-api/site/sites.service";
import { AdminAudioRecordingComponent } from "@component/admin/audio-recordings/details/details.component";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { generateSite } from "@test/fakes/Site";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { nStepObservable } from "@test/helpers/general";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AdminOrphanComponent } from "./details.component";

describe("AdminOrphanComponent", () => {
  let component: AdminOrphanComponent;
  let fixture: ComponentFixture<AdminOrphanComponent>;
  let injector: Injector;

  function configureTestingModule(model: Site, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [AdminAudioRecordingComponent],
      providers: [
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

    const accountsSubject = new Subject<User>();
    const projectsSubject = new Subject<Project[]>();
    const promise = Promise.all([
      nStepObservable(
        accountsSubject,
        () => new User({ id: 1, userName: "custom username" })
      ),
      nStepObservable(projectsSubject, () =>
        [1, 2, 3].map(
          (id) => new Project({ id, siteIds: [1], name: "custom project" })
        )
      ),
    ]);

    // Catch associated models
    spyOn(accountsApi, "show").and.callFake(() => accountsSubject);
    spyOn(projectsApi, "filter").and.callFake(() => projectsSubject);

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }

    return promise;
  }

  it("should create", () => {
    configureTestingModule(new Site(generateSite()));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle error", () => {
    configureTestingModule(undefined, {
      status: 401,
      message: "Unauthorized",
    } as ApiErrorDetails);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("details", () => {
    const model = new Site({
      ...generateSite(),
      locationObfuscated: true,
      projectIds: [1, 2, 3],
    });

    beforeEach(async function () {
      const promise = configureTestingModule(model);
      fixture.detectChanges();
      await promise;
      fixture.detectChanges();
      this.fixture = fixture;
    });

    const details: Detail[] = [
      { label: "Site Id", key: "id", plain: model.id },
      { label: "Site Name", key: "name", plain: model.name },
      { label: "Description", key: "description", plain: model.description },
      {
        label: "Location Obfuscated",
        key: "locationObfuscated",
        checkbox: model.locationObfuscated,
      },
      { label: "Latitude", key: "latitude", plain: model.latitude },
      { label: "Longitude", key: "longitude", plain: model.longitude },
      {
        label: "Custom Latitude",
        key: "customLatitude",
        plain: model.customLatitude,
      },
      {
        label: "Custom Longitude",
        key: "customLongitude",
        plain: model.customLongitude,
      },
      { label: "Image", key: "imageUrl", image: model.imageUrl },
      { label: "Image", key: "image", image: model.image },
      { label: "Time Zone Identifier", key: "tzInfoTz", plain: model.tzinfoTz },
      {
        label: "Time Zone Information",
        key: "timezoneInformation",
        code: model.timezoneInformation,
      },
      { label: "Creator", key: "creator", model: "User: custom username (1)" },
      { label: "Updater", key: "updater", model: "User: custom username (1)" },
      { label: "Created At", key: "createdAt", plain: model.createdAt },
      { label: "Updated At", key: "updatedAt", plain: model.updatedAt },
      {
        label: "Projects",
        key: "projects",
        children: [1, 2, 3].map((id) => ({
          model: `Project: custom project (${id})`,
        })),
      },
    ];

    details.forEach((detail) => assertDetail(detail));
  });
});
