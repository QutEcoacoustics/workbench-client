import { Spectator, createRoutingFactory, SpyObject } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { DeleteModalComponent } from "./delete-modal.component";

describe("ConfirmationModalComponent", () => {
  let spectator: Spectator<DeleteModalComponent>;
  let mockSharedActivatedRoute: SpyObject<SharedActivatedRouteService>;
  let mockPageComponent: PageComponent;

  const createComponent = createRoutingFactory({
    component: DeleteModalComponent,
    imports: [ MockBawApiModule ],
    mocks: [ ToastrService, NgbModalRef ],
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
    return spectator.debugElement.query(
      (el) => el.nativeElement.innerText === text
    ).nativeElement as T;
  }

  const getDeleteButton = (): HTMLAnchorElement => getElementByInnerText<HTMLAnchorElement>("Delete");
  const getCancelButton = (): HTMLAnchorElement => getElementByInnerText<HTMLAnchorElement>("Cancel");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(DeleteModalComponent);
  });

  it("should invoke the success callback when the delete button is clicked", () => {
    spyOn(spectator.component, "successCallback").and.stub();
    getDeleteButton().click();
    expect(spectator.component.successCallback).toHaveBeenCalledTimes(1);
  });

  it("should close the modal when the cancel button is clicked", () => {
    spyOn(spectator.component, "closeModal").and.stub();
    getCancelButton().click();
    expect(spectator.component.closeModal).toHaveBeenCalledWith(false);
  });

  it("should close the modal when the delete button is clicked", () => {
    spyOn(spectator.component, "closeModal").and.stub();
    getDeleteButton().click();
    expect(spectator.component.closeModal).toHaveBeenCalledWith(true);
  });
});
