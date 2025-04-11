import { Spectator, SpyObject, createRoutingFactory } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ToastService } from "@services/toasts/toasts.service";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { PageComponent } from "@helpers/page/pageComponent";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { DeleteSiteModalComponent } from "./delete-site-modal.component";

describe("DeleteSiteModalComponent", () => {
  let spectator: Spectator<DeleteSiteModalComponent>;
  let mockSharedActivatedRoute: SpyObject<SharedActivatedRouteService>;
  let mockPageComponent: PageComponent;

  const createComponent = createRoutingFactory({
    component: DeleteSiteModalComponent,
    imports: [MockBawApiModule],
    mocks: [ToastService, NgbModalRef],
  });

  function setup(): void {
    mockPageComponent = new PageComponent({});

    spectator = createComponent();
    spectator.component.closeModal = () => null;
    spectator.component.dismissModal = () => null;
    spectator.component.successCallback = () => null;

    mockSharedActivatedRoute = spectator.inject(SharedActivatedRouteService);
    spyOnProperty(mockSharedActivatedRoute, "pageComponentInstance", "get").and.returnValue(mockPageComponent);
  }

  beforeEach(() => setup());

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query((el) => el.nativeElement.innerText === text).nativeElement as T;
  }

  const getDeleteButton = (): HTMLAnchorElement => getElementByInnerText<HTMLAnchorElement>("Delete");
  const getCancelButton = (): HTMLAnchorElement => getElementByInnerText<HTMLAnchorElement>("Cancel");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(DeleteSiteModalComponent);
  });

  // duplicate test from delete-modal.component.spec.ts to ensure no extended functionality is lost
  it("should invoke the success callback when the delete button is clicked", () => {
    spyOn(spectator.component, "successCallback").and.stub();
    getDeleteButton().click();
    expect(spectator.component.successCallback).toHaveBeenCalledTimes(1);
  });

  // duplicate test from delete-modal.component.spec.ts to ensure no extended functionality is lost
  it("should close the modal when the cancel button is clicked", () => {
    spyOn(spectator.component, "closeModal").and.stub();
    getCancelButton().click();
    expect(spectator.component.closeModal).toHaveBeenCalledWith(false);
  });

  // duplicate test from delete-modal.component.spec.ts to ensure no extended functionality is lost
  it("should close the modal when the delete button is clicked", () => {
    spyOn(spectator.component, "closeModal").and.stub();
    getDeleteButton().click();
    expect(spectator.component.closeModal).toHaveBeenCalledWith(true);
  });

  it("should dismiss the modal when the 'Contact Us' link is clicked", () => {
    const contactUsLinkElement: HTMLAnchorElement = getElementByInnerText<HTMLAnchorElement>("Contact Us");
    spyOn(spectator.component, "dismissModal").and.stub();

    contactUsLinkElement.click();

    expect(spectator.component.dismissModal).toHaveBeenCalledWith(false);
  });

  it("should have the correct text for points", () => {
    spectator.component.isPoint = true;
    spectator.detectChanges();

    const expectedText =
      "When this point is deleted it will be made " +
      "invisible. For data safety: all audio recordings will no longer be " +
      "accessible but will be recoverable. If you need to recover these " +
      "recordings after they have been deleted, please Contact Us.";

    expect(getElementByInnerText(expectedText)).toExist();
  });

  it("should have the correct test for sites", () => {
    spectator.component.isPoint = false;
    spectator.detectChanges();

    const expectedText =
      "When this site is deleted it will be made " +
      "invisible. For data safety: all audio recordings will no longer be " +
      "accessible but will be recoverable. If you need to recover these " +
      "recordings after they have been deleted, please Contact Us.";

    expect(getElementByInnerText(expectedText)).toExist();
  });
});
