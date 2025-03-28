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
});
