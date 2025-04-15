import { assertPageInfo } from "@test/helpers/pageRoute";
import { Spectator, SpyObject, createRoutingFactory } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ToastService } from "@services/toasts/toasts.service";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { UserLinkComponent } from "@shared/user-link/user-link.component";
import { SHALLOW_HARVEST } from "@baw-api/ServiceTokens";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { of } from "rxjs";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { generateHarvest } from "@test/fakes/Harvest";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AllUploadsComponent } from "./all-uploads.component";

// the functionality that the project names are shown in the harvest list
// and the correct api calls are made is asserted in the harvest list component
// these tests assert that the harvest list component is extended correctly
describe("AllUploadsComponent", () => {
  let spectator: Spectator<AllUploadsComponent>;
  let fakeHarvest: Harvest;
  let fakeHarvestApi: SpyObject<ShallowHarvestsService>;

  const createComponent = createRoutingFactory({
    component: AllUploadsComponent,
    imports: [
      MockBawApiModule,
      LoadingComponent,
      ConfirmationComponent,
      UserLinkComponent,
    ],
    mocks: [ToastService],
  });

  function setup(): void {
    fakeHarvest = new Harvest(generateHarvest({ status: "uploading" }));

    spectator = createComponent({ detectChanges: false });

    const injector = spectator.inject(ASSOCIATION_INJECTOR);
    fakeHarvest["injector"] = injector;

    fakeHarvestApi = spectator.inject(SHALLOW_HARVEST.token);
    fakeHarvest.addMetadata({
      paging: { items: 1, page: 0, total: 1, maxPage: 5 },
    });

    // since the harvest creator is a resolved model, we need to mock the creator property
    const fakeUser: User = new User(generateUser());
    spyOnProperty(fakeHarvest, "creator").and.callFake(() => fakeUser);

    const mockHarvestProject: Project = new Project(generateProject());
    spyOnProperty(fakeHarvest, "project").and.callFake(
      () => mockHarvestProject
    );

    // mock the harvest service filter API to populate the
    // list component ngx-datatable
    const mockResponse = of([fakeHarvest]);
    fakeHarvestApi.filter.and.callFake(() => mockResponse);
    fakeHarvestApi.transitionStatus.and.callFake(() => of(fakeHarvest));

    spectator.detectChanges();
  }

  beforeEach(() => setup());

  assertPageInfo(AllUploadsComponent, [
    "Recording Uploads",
    "All Recording Uploads",
  ]);

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AllUploadsComponent);
  });

  it("should return 'null' for the project", () => {
    expect(spectator.component.project).toBeNull();
  });

  it("should have the harvest list table", () => {
    const datatableElement: HTMLElement =
      spectator.query<HTMLElement>("ngx-datatable");
    expect(datatableElement).toExist();
  });

  it("should make the correct api calls", () => {
    expect(fakeHarvestApi.transitionStatus).not.toHaveBeenCalled();

    // test that the filter object that the filter service was called with did not contain a filter key
    expect(fakeHarvestApi.filter).not.toHaveBeenCalledWith(
      jasmine.objectContaining({
        filter: jasmine.any(Object),
      })
    );

    // assert that projection conditions were still applied to the request body
    expect(fakeHarvestApi.filter).toHaveBeenCalledWith(
      jasmine.objectContaining({
        projection: {
          include: [
            "id",
            "projectId",
            "name",
            "createdAt",
            "creatorId",
            "streaming",
            "status",
          ],
        },
      })
    );
  });
});
