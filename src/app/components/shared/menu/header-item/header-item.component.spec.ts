import { RouterTestingModule } from "@angular/router/testing";
import { MockDirectivesModule } from "@directives/directives.mock.module";
import { MenuLink, menuLink, MenuRoute, menuRoute, NavigableMenuItem } from "@interfaces/menusInterfaces";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MockConfigModule } from "@services/config/configMock.module";
import { generateMenuLink, generateMenuRoute } from "@test/fakes/MenuItem";
import { HeaderItemComponent } from "./header-item.component";

describe("HeaderItemComponent", () => {
  let defaultLink: MenuLink;
  let defaultRoute: MenuRoute;
  let spec: Spectator<HeaderItemComponent>;
  const createComponent = createComponentFactory({
    component: HeaderItemComponent,
    imports: [RouterTestingModule, MockDirectivesModule, MockConfigModule],
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
