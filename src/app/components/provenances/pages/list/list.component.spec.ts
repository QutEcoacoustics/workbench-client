import { createRoutingFactory, mockProvider, SpectatorRouting, SpyObject } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ToastService } from "@services/toasts/toasts.service";
import { Provenance } from "@models/Provenance";
import { generateProvenance } from "@test/fakes/Provenance";
import { ProvenanceService } from "@baw-api/provenance/provenance.service";
import { of } from "rxjs";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { AccountsService } from "@baw-api/account/accounts.service";
import { fakeAsync, flush } from "@angular/core/testing";
import { assertDatatable } from "@test/helpers/datatable";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { modelData } from "@test/helpers/faker";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { clickButton } from "@test/helpers/html";
import { ProvenanceListComponent } from "./list.component";

describe("ProvenanceListComponent", () => {
  let spec: SpectatorRouting<ProvenanceListComponent>;

  let apiSpy: SpyObject<ProvenanceService>;
  let modalService: SpyObject<NgbModal>;

  let mockResponse: Provenance[];
  let mockUser = new User(generateUser());

  const createComponent = createRoutingFactory({
    component: ProvenanceListComponent,
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  // By using spec.query, we are getting the first delete button on the page
  // which resolves to the first item in our mockResponse array.
  const deleteButton = () => spec.query<HTMLButtonElement>("[name='delete-button']");
  const tableElement = () => spec.query<HTMLTableElement>("ngx-datatable");

  beforeEach(fakeAsync(() => {
    spec = createComponent({
      detectChanges: false,
      providers: [
        mockProvider(AccountsService, {
          show: () => of(mockUser),
        }),
      ],
    });

    const injector = spec.inject(ASSOCIATION_INJECTOR);
    mockResponse = modelData.randomArray(
      1,
      25,
      () => new Provenance(generateProvenance(), injector),
    );
    mockResponse.forEach((item) => {
      item.addMetadata({
        paging: {
          items: mockResponse.length,
          page: 1,
          total: mockResponse.length,
          maxPage: 1,
        },
      });
    });

    modalService = spec.inject(NgbModal);

    apiSpy = spec.inject(ProvenanceService);
    apiSpy.filter.and.returnValue(of(mockResponse));
    apiSpy.destroy.and.returnValue(of());

    // We need this flush so that the user associations in the <baw-user-link>
    // component resolve before we run tests.
    spec.detectChanges();
    flush();
    spec.detectChanges();
  }));

  afterEach(() => {
    // if we keep modals open, it will impact the next test
    // therefore, we should dismiss all modals at the end of every test
    modalService.dismissAll();
  });

  assertPageInfo(ProvenanceListComponent, "Provenances");

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ProvenanceListComponent);
  });

  it("should make one api call on load", () => {
    expect(apiSpy.filter).toHaveBeenCalledOnceWith({
      sorting: { direction: "desc", orderBy: "createdAt" },
      paging: { page: 1 },
    });
  });

  it("should make the correct api calls when the delete button is clicked", () => {
    // This click button helper also handles checking that the element exists,
    // the element is a button, and that the button is enabled.
    clickButton(spec, deleteButton());

    // Once the delete button is clicked, a modal is shown to confirm deletion.
    // However, since ngbModals open at the document body level instead of the
    // component level, we cannot use spec.query to find the modal elements.
    // Therefore, we use document.querySelector to find the modal elements.
    const confirmSelector = "[data-testid='delete-confirm-button']";
    const confirmButton = document.querySelector(confirmSelector);
    clickButton(spec, confirmButton);
  });

  it("should not make any api calls when the delete modal is dismissed", () => {
    clickButton(spec, deleteButton());

    const cancelSelector = "[data-testid='delete-cancel-button']";
    const cancelButton = document.querySelector(cancelSelector);
    clickButton(spec, cancelButton);

    expect(apiSpy.destroy).not.toHaveBeenCalled();
  });

  describe("datatable", () => {
    assertDatatable(() => ({
      root: () => tableElement(),
      columns: () => ["Name", "Version", "Description", "Created By", "Action"],
      rows: () => mockResponse.map((item) => ({
        Name: item.name,
        Version: item.version,
        Description: item.description,
        "Created By": mockUser.userName,
        Action: "",
      })),
    }));
  });
});
