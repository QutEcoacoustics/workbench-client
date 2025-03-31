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

  const licenseWidget = () => spec.query<HTMLDivElement>("#license-widget");

  function setup(model?: any): void {
    spec = createComponent({
      detectChanges: false,
      providers: [
        mockProvider(SharedActivatedRouteService, {
          pageInfo: new Subject<PageInfo>().next(model),
        }),
      ],
    });

    spec.detectChanges();
  }

  fit("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(LicenseWidgetComponent);
  });

  it("should handle no license", () => {
    expect(licenseWidget()).not.toExist();
  });

  it("should handle a license with an empty name", () => {
  });

  it("should handle a single license", () => {});

  it("should handle a site with multiple licenses", () => {});

  // Testing an audio event with multiple licenses is a hard task because
  // events may have multiple licenses with extensive degrees of separation.
  // E.g. An audio event must fetch the licenses through the associations
  // Audio Event > Audio Recording > Site > Projects (multiple) > License
  it("should handle a audio event with multiple licenses", () => {});

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
