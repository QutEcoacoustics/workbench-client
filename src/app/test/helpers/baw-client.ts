import { Type } from "@angular/core";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { StrongRoute } from "@interfaces/strongRoute";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { BawClientComponent } from "@shared/baw-client/baw-client.component";
import { SharedModule } from "@shared/shared.module";
import { websiteHttpUrl } from "./url";

//TODO: OLD-CLIENT REMOVE
export function validateBawClientPage<Component extends Type<any>>(
  routes: StrongRoute,
  component: Component,
  modules: any[],
  route: string,
  validatePageLoaded: string | string[] | ((text: string[]) => boolean),
  interceptApiRequests?: (spec: SpectatorRouting<Component>) => void
) {
  let spec: SpectatorRouting<Component>;
  let config: ConfigService;
  const compiledRoutes = routes.compileRoutes(getRouteConfigForPage);
  const createComponent = createRoutingFactory({
    component,
    imports: [SharedModule, MockBawApiModule, ...modules],
    routes: compiledRoutes,
    stubsEnabled: false,
  });

  function bawClientSource() {
    return websiteHttpUrl + config.getBawClientUrl(route);
  }

  function getBawClient() {
    return spec.query(BawClientComponent);
  }

  function waitForLoad() {
    return new Promise<void>((resolve) =>
      getBawClient()["iframeRef"].nativeElement.addEventListener("load", () =>
        resolve()
      )
    );
  }

  function setup(url: string) {
    spec = createComponent();
    config = spec.inject(ConfigService);
    interceptApiRequests?.(spec);
    spec.router.navigateByUrl(url);
    spec.detectChanges();
  }

  it("should have correct route", async () => {
    setup(route);
    await waitForLoad();
    spec.detectChanges();

    const bawClient = getBawClient();
    expect(bawClient).toBeTruthy();
    expect(bawClient["iframeRef"].nativeElement.src).toEqual(bawClientSource());
  });

  it("should load page", async () => {
    setup(route);
    await waitForLoad();
    spec.detectChanges();

    const bawClient = getBawClient();
    expect(
      bawClient["iframeRef"].nativeElement.contentWindow.document.body
    ).toContainText(validatePageLoaded);
  });
}
