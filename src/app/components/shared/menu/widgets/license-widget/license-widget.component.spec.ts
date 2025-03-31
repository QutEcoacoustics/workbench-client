import { createComponentFactory, mockProvider, Spectator } from "@ngneat/spectator";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { PageInfo } from "@helpers/page/pageInfo";
import { Subject } from "rxjs";
import { LicenseWidgetComponent } from "./license-widget.component";

describe("LicenseWidgetComponent", () => {
  let spec: Spectator<LicenseWidgetComponent>;

  const createComponent = createComponentFactory({
    component: LicenseWidgetComponent,
  });

  function setup(): void {
    spec = createComponent({
      detectChanges: false,
      providers: [
        mockProvider(SharedActivatedRouteService, {
          pageInfo: new Subject<PageInfo>(),
        }),
      ],
    });

    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(LicenseWidgetComponent);
  });

  it("should handle no license", () => {});

  it("should handle a license with an empty name", () => {});

  it("should handle a single license", () => {});

  it("should handle multiple licenses", () => {});

  // Because project license information is free-form text, we don't want users
  // to enter a license that would expand the height of the viewport by a large
  // amount.
  // Expanding the height of the viewport would cause a degraded user
  // experience, especially on mobile devices.
  //
  // This problem might arise if a user uses the API to add a license, and
  // inputs the entire license content instead of the license name.
  it("should have a limit on the license widget size", () => {});
});
