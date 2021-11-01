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

// TODO Add tests to validate ng-content is respected
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

  describe("internal routes", () => {
    beforeEach(() => {
      setup(defaultRoute);
      spec.detectChanges();
    });

    it("should render with label", () => {
      expect(getLink()).toContainText(defaultRoute.label);
    });

    it("should have router link", () => {
      assertStrongRouteLink(getLink(), defaultRoute.route.toRouterLink());
    });

    it("should have router link active attribute", () => {
      assertStrongRouteActive(getLink());
    });
  });

  describe("external links", () => {
    beforeEach(() => {
      setup(defaultLink);
      spec.detectChanges();
    });

    it("should render external link with label", () => {
      expect(getLink()).toContainText(defaultLink.label);
    });

    it("external link should have href", () => {
      assertHref(getLink(), defaultLink.uri());
    });
  });
});
