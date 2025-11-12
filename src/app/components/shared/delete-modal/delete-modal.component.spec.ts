import { Spectator, createRoutingFactory, SpyObject } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toasts/toasts.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { getElementByTextContent } from "@test/helpers/html";
import { DeleteModalComponent } from "./delete-modal.component";

describe("ConfirmationModalComponent", () => {
  let spectator: Spectator<DeleteModalComponent>;
  let mockSharedActivatedRoute: SpyObject<SharedActivatedRouteService>;
  let mockPageComponent: PageComponent;

  const createComponent = createRoutingFactory({
    component: DeleteModalComponent,
    providers: [provideMockBawApi()],
    mocks: [ToastService, NgbModalRef],
  });

  function setup(): void {
    mockPageComponent = new PageComponent({});

    spectator = createComponent();
    spectator.component.closeModal = () => null;
    spectator.component.dismissModal = () => null;
    spectator.component.successCallback = () => null;

    mockSharedActivatedRoute = spectator.inject(SharedActivatedRouteService);
    spyOnProperty(
      mockSharedActivatedRoute,
      "pageComponentInstance",
      "get"
    ).and.returnValue(mockPageComponent);
  }

  beforeEach(() => {
    setup();
  });

  const getDeleteButton = () =>
    getElementByTextContent<HTMLAnchorElement>(spectator, "Delete");
  const getCancelButton = () =>
    getElementByTextContent<HTMLAnchorElement>(spectator, "Cancel");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(DeleteModalComponent);
  });

  it("should invoke the success callback when the delete button is clicked", () => {
    spyOn(spectator.component, "successCallback").and.stub();
    spectator.click(getDeleteButton());
    expect(spectator.component.successCallback).toHaveBeenCalledTimes(1);
  });

  it("should close the modal when the cancel button is clicked", () => {
    spyOn(spectator.component, "closeModal").and.stub();
    spectator.click(getCancelButton());
    expect(spectator.component.closeModal).toHaveBeenCalledWith(false);
  });

  it("should close the modal when the delete button is clicked", () => {
    spyOn(spectator.component, "closeModal").and.stub();
    spectator.click(getDeleteButton());
    expect(spectator.component.closeModal).toHaveBeenCalledWith(true);
  });
});
