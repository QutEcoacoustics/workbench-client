import { createRoutingFactory, mockProvider, SpectatorRouting } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { Provenance } from "@models/Provenance";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { generateProvenance } from "@test/fakes/Provenance";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { provenanceResolvers } from "@baw-api/provenance/provenance.service";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { of } from "rxjs";
import { AccountsService } from "@baw-api/account/accounts.service";
import { ProvenanceDetailsComponent } from "./details.component";

describe("ProvenanceDetailsComponent", () => {
  let spec: SpectatorRouting<ProvenanceDetailsComponent>;
  let mockUser = new User(generateUser());

  const createComponent = createRoutingFactory({
    component: ProvenanceDetailsComponent,
    providers: [provideMockBawApi()],
  });

  function setup(testModel: Provenance | BawApiError): void {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          provenance: provenanceResolvers.show,
        },
        provenance: { model: testModel },
      },
      providers: [
        mockProvider(AccountsService, {
          show: () => of(mockUser),
        }),
      ],
    });

    // By updating the test model by reference, we also update the activated
    // route data.
    // This is a hack that I do because we cannot access the injector when we
    // initialize the route data above.
    const injector = spec.inject(ASSOCIATION_INJECTOR);
    testModel["injector"] = injector;

    spec.detectChanges();
  }

  assertPageInfo(ProvenanceDetailsComponent, "Test Provenance", {
    provenance: {
      model: new Provenance(generateProvenance({ name: "Test Provenance" })),
    },
  });

  it("should create", () => {
    setup(new Provenance(generateProvenance()));
    expect(spec.component).toBeInstanceOf(ProvenanceDetailsComponent);
  });

  it("should handle error", () => {
    setup(generateBawApiError());
    expect(spec.component).toBeTruthy();
  });

  fdescribe("details", () => {
    const testModel = new Provenance(generateProvenance());

    const details: Detail[] = [
      { label: "Provenance Id", key: "id", plain: testModel.id },
      { label: "Provenance Name", key: "name", plain: testModel.name },
      { label: "Version", key: "version", plain: testModel.version },
      { label: "Description", key: "description", plain: testModel.description },
      { label: "Score Minimum", key: "scoreMinimum", plain: testModel.scoreMinimum },
      { label: "Score Maximum", key: "scoreMaximum", plain: testModel.scoreMaximum },
      { label: "Creator", key: "creator", model: mockUser.userName },
      { label: "Created At", key: "createdAt", dateTime: testModel.createdAt },
      { label: "Updater", key: "updater", model: mockUser.userName },
      { label: "Updated At", key: "updatedAt", dateTime: testModel.updatedAt },
      { label: "Deleter", key: "deleter", model: mockUser.userName },
      { label: "Deleted At", key: "deletedAt", dateTime: testModel.deletedAt },
    ];

    beforeEach(() => {
      setup(testModel);
    });

    for (const detail of details) {
      assertDetail(detail, () => spec);
    }
  });
});
