import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ACCOUNT, PROJECT } from "@baw-api/ServiceTokens";
import { shallowSiteResolvers } from "@baw-api/site/sites.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateSite } from "@test/fakes/Site";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { interceptMappedApiRequests, nStepObservable } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { of, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Id } from "@interfaces/apiInterfaces";
import { AdminOrphanComponent } from "./details.component";

describe("AdminOrphanComponent", () => {
  let component: AdminOrphanComponent;
  let fixture: ComponentFixture<AdminOrphanComponent>;
  let injector: AssociationInjector;
  const siteProjectIds = [1, 2, 3];

  function setup(model: Site, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule, MockBawApiModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute({ site: shallowSiteResolvers.show }, { site: { model, error } }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrphanComponent);
    injector = TestBed.inject(ASSOCIATION_INJECTOR);

    const accountsApi = TestBed.inject(ACCOUNT.token) as SpyObject<AccountsService>;
    const projectsApi = TestBed.inject(PROJECT.token) as SpyObject<ProjectsService>;

    component = fixture.componentInstance;

    const mockProjectApiResponses = new Map<any, Project>([
      [1, new Project({ id: 1, siteIds: [1], name: "custom project" })],
      [2, new Project({ id: 2, siteIds: [1], name: "custom project" })],
      [3, new Project({ id: 3, siteIds: [1], name: "custom project" })],
    ]);
    projectsApi.show.and.callFake((id: Id) => of(mockProjectApiResponses.get(id)));

    const accountsSubject = new Subject<User>();
    const promise = Promise.all([
      nStepObservable(accountsSubject, () => new User({ id: 1, userName: "custom username" })),
      ...interceptMappedApiRequests(projectsApi.show, mockProjectApiResponses),
    ]);

    // Catch associated models
    accountsApi.show.and.callFake(() => accountsSubject);

    // Update model to contain injector
    if (model) {
      model["injector"] = injector;
    }

    return promise;
  }

  assertPageInfo<Site>(AdminOrphanComponent, "Test Orphaned Site", {
    site: {
      model: new Site(generateSite({ name: "Test Orphaned Site" })),
    },
  });

  it("should create", () => {
    setup(new Site(generateSite()));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle error", () => {
    setup(undefined, generateBawApiError());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("details", () => {
    const model = new Site(generateSite({ locationObfuscated: true, projectIds: siteProjectIds }));

    beforeEach(async function () {
      const promise = setup(model);
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
      { label: "Images", key: "imageUrls", image: model.imageUrls },
      { label: "Time Zone Identifier", key: "tzInfoTz", plain: model.tzinfoTz },
      {
        label: "Time Zone Information",
        key: "timezoneInformation",
        code: model.timezoneInformation,
      },
      { label: "Creator", key: "creator", model: "User: custom username (1)" },
      { label: "Updater", key: "updater", model: "User: custom username (1)" },
      { label: "Created At", key: "createdAt", dateTime: model.createdAt },
      { label: "Updated At", key: "updatedAt", dateTime: model.updatedAt },
      {
        label: "Projects",
        key: "projects",
        children: siteProjectIds.map((id) => ({
          model: `Project: custom project (${id})`,
        })),
      },
    ];

    details.forEach((detail) => assertDetail(detail));
  });
});
