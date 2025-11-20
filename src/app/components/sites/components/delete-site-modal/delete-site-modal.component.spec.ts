import { Spectator, SpyObject, createRoutingFactory } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ToastService } from "@services/toasts/toasts.service";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { PageComponent } from "@helpers/page/pageComponent";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { getElementByTextContent } from "@test/helpers/html";
import { DeleteSiteModalComponent } from "./delete-site-modal.component";

describe("DeleteSiteModalComponent", () => {
  let spectator: Spectator<DeleteSiteModalComponent>;
  let mockSharedActivatedRoute: SpyObject<SharedActivatedRouteService>;
  let mockPageComponent: PageComponent;

  const createComponent = createRoutingFactory({
    component: DeleteSiteModalComponent,
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

  beforeEach(() => setup());

  const getDeleteButton = (): HTMLAnchorElement =>
    getElementByTextContent<HTMLAnchorElement>(spectator, "Delete");
  const getCancelButton = (): HTMLAnchorElement =>
    getElementByTextContent<HTMLAnchorElement>(spectator, "Cancel");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(DeleteSiteModalComponent);
  });

  // duplicate test from delete-modal.component.spec.ts to ensure no extended functionality is lost
  it("should invoke the success callback when the delete button is clicked", () => {
    spyOn(spectator.component, "successCallback").and.stub();
    spectator.click(getDeleteButton());
    expect(spectator.component.successCallback).toHaveBeenCalledTimes(1);
  });

  // duplicate test from delete-modal.component.spec.ts to ensure no extended functionality is lost
  it("should close the modal when the cancel button is clicked", () => {
    spyOn(spectator.component, "closeModal").and.stub();
    spectator.click(getCancelButton());
    expect(spectator.component.closeModal).toHaveBeenCalledWith(false);
  });

  // duplicate test from delete-modal.component.spec.ts to ensure no extended functionality is lost
  it("should close the modal when the delete button is clicked", () => {
    spyOn(spectator.component, "closeModal").and.stub();
    spectator.click(getDeleteButton());
    expect(spectator.component.closeModal).toHaveBeenCalledWith(true);
  });

  it("should dismiss the modal when the 'Contact Us' link is clicked", () => {
    const contactUsLinkElement: HTMLAnchorElement =
      getElementByTextContent<HTMLAnchorElement>(spectator, "Contact Us");
    spyOn(spectator.component, "dismissModal").and.stub();

    spectator.click(contactUsLinkElement);

    expect(spectator.component.dismissModal).toHaveBeenCalledWith(false);
  });

  it("should have the correct text for points", () => {
    spectator.component.isPoint = true;
    spectator.detectChanges();

    const expectedText = "When this point is deleted it will be made " +
      "invisible. For data safety: all audio recordings will no longer be " +
      "accessible but will be recoverable. If you need to recover these " +
      "recordings after they have been deleted, please Contact Us."

    expect(getElementByTextContent(spectator, expectedText)).toExist();
  });

  it("should have the correct test for sites", () => {
    spectator.component.isPoint = false;
    spectator.detectChanges();

    const expectedText = "When this site is deleted it will be made " +
      "invisible. For data safety: all audio recordings will no longer be " +
      "accessible but will be recoverable. If you need to recover these " +
      "recordings after they have been deleted, please Contact Us."

    expect(getElementByTextContent(spectator, expectedText)).toExist();
  });
});
