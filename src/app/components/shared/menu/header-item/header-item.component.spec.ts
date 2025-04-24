import {
  MenuLink,
  menuLink,
  MenuRoute,
  menuRoute,
  NavigableMenuItem,
} from "@interfaces/menusInterfaces";
import { createRoutingFactory, Spectator } from "@ngneat/spectator";
import { provideMockConfig } from "@services/config/provideMockConfig";
import { generateMenuLink, generateMenuRoute } from "@test/fakes/MenuItem";
import { StrongRouteActiveDirective } from "@directives/strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { MockDirective } from "ng-mocks";
import { HeaderItemComponent } from "./header-item.component";

describe("HeaderItemComponent", () => {
  let defaultLink: MenuLink;
  let defaultRoute: MenuRoute;
  let spec: Spectator<HeaderItemComponent>;

  const createComponent = createRoutingFactory({
    component: HeaderItemComponent,
    imports: [
      MockDirective(StrongRouteActiveDirective),
      MockDirective(StrongRouteDirective),
    ],
    providers: [provideMockConfig()],
  });

  function getLink() {
    return spec.query<HTMLAnchorElement>("a");
  }

  function setup(link: NavigableMenuItem) {
    spec = createComponent({ detectChanges: false, props: { link } });
  }

  beforeEach(() => {
    defaultLink = menuLink(generateMenuLink());
    defaultRoute = menuRoute(generateMenuRoute());
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
      expect(getLink()).toHaveStrongRoute(defaultRoute.route);
    });

    it("should have router link active attribute", () => {
      expect(getLink()).toHaveStrongRouteActive("active");
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
      expect(getLink()).toHaveHref(defaultLink.uri());
    });
  });
});
