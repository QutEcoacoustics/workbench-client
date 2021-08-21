import { RouterTestingModule } from "@angular/router/testing";
import { DirectivesModule } from "@directives/directives.module";
import {
  MenuLink,
  menuLink,
  MenuRoute,
  menuRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { modelData } from "@test/helpers/faker";
import {
  assertHref,
  assertStrongRouteActive,
  assertStrongRouteLink,
} from "@test/helpers/html";
import { HeaderItemComponent } from "./header-item.component";

describe("HeaderItemComponent", () => {
  let defaultUri: string;
  let defaultLink: MenuLink;
  let defaultRoute: MenuRoute;
  let spec: Spectator<HeaderItemComponent>;
  const createComponent = createComponentFactory({
    component: HeaderItemComponent,
    imports: [RouterTestingModule, DirectivesModule, MockAppConfigModule],
  });

  function getLink() {
    return spec.query<HTMLAnchorElement>("a");
  }

  function setup(link: NavigableMenuItem) {
    spec = createComponent({ detectChanges: false, props: { link } });
  }

  beforeEach(() => {
    defaultUri = modelData.internet.url();
    defaultLink = menuLink({
      label: modelData.param(),
      uri: () => defaultUri,
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
    });
    defaultRoute = menuRoute({
      label: modelData.param(),
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.newRoot().add("home"),
    });
  });

  it("should handle internal link", () => {
    setup(defaultRoute);
    spec.detectChanges();
    expect(getLink()).toContainText(defaultRoute.label);
  });

  it("internal link should have router link", () => {
    setup(defaultRoute);
    spec.detectChanges();
    assertStrongRouteLink(getLink(), defaultRoute.route.toRouterLink());
  });

  it("internal link should have router link active attribute", () => {
    setup(defaultRoute);
    spec.detectChanges();
    assertStrongRouteActive(getLink());
  });

  it("should handle external link", () => {
    setup(defaultLink);
    spec.detectChanges();
    expect(getLink()).toContainText(defaultLink.label);
  });

  it("external link should have href", () => {
    setup(defaultLink);
    spec.detectChanges();
    assertHref(getLink(), defaultLink.uri());
  });
});
