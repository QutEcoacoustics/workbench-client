import { UrlSegment } from "@angular/router";
import { DirectivesModule } from "@directives/directives.module";
import { HeaderGroupConverted } from "@helpers/app-initializer/app-initializer";
import {
  MenuLink,
  menuLink,
  MenuRoute,
  menuRoute,
} from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { modelData } from "@test/helpers/faker";
import {
  assertHref,
  assertStrongRouteLink,
  assertStrongRouteActive,
} from "@test/helpers/html";
import { HeaderDropdownComponent } from "./header-dropdown.component";

describe("HeaderDropdownComponent", () => {
  let defaultUri: string;
  let defaultLink: MenuLink;
  let defaultRoute: MenuRoute;
  let spec: SpectatorRouting<HeaderDropdownComponent>;
  const createComponent = createRoutingFactory({
    component: HeaderDropdownComponent,
    imports: [DirectivesModule, MockAppConfigModule],
    stubsEnabled: false,
  });

  function setup(links: HeaderGroupConverted, url: string = "") {
    spec = createComponent({
      detectChanges: false,
      props: { links },
      url: [new UrlSegment(url, {})],
    });
  }

  function getLinks() {
    return spec.queryAll<HTMLAnchorElement>("a");
  }

  function assertInternalLink(index: number, menu: MenuRoute) {
    const link = getLinks()[index];
    expect(link).toContainText(menu.label);
    assertStrongRouteLink(link, menu.route.toRouterLink());
  }

  function assertExternalLink(index: number, label: string, href: string) {
    const link = getLinks()[index];
    expect(link).toContainText(label);
    assertHref(link, href);
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

  it("should create header title", () => {
    setup({ title: "Custom Title", items: [defaultLink] });
    spec.detectChanges();
    expect(spec.query("button")).toContainText("Custom Title");
  });

  it("should handle single internal link", () => {
    setup({ title: "title", items: [defaultRoute] });
    spec.detectChanges();
    assertInternalLink(0, defaultRoute);
  });

  it("should set strong route link active property on internal link", () => {
    setup({ title: "title", items: [defaultRoute] });
    spec.detectChanges();
    assertStrongRouteActive(getLinks()[0]);
  });

  it("should handle multiple internal links", () => {
    const items = [
      defaultRoute,
      menuRoute({
        label: modelData.param(),
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        route: StrongRoute.newRoot().add("house"),
      }),
    ];
    setup({ title: "title", items });
    spec.detectChanges();

    expect(getLinks().length).toBe(2);
    items.forEach((item, index) => {
      assertInternalLink(index, item);
    });
  });

  it("should handle single external link", () => {
    setup({ title: "title", items: [defaultLink] });
    spec.detectChanges();
    assertExternalLink(0, defaultLink.label, defaultUri);
  });

  it("should handle multiple external links", () => {
    const uriList = [defaultUri, modelData.internet.url()];
    const items = [
      defaultLink,
      menuLink({
        label: modelData.param(),
        icon: ["fas", "home"],
        tooltip: () => "tooltip",
        uri: () => uriList[1],
      }),
    ];
    setup({ title: "title", items });
    spec.detectChanges();

    expect(getLinks().length).toBe(2);
    items.forEach((item, index) => {
      assertExternalLink(index, item.label, uriList[index]);
    });
  });

  it("should handle mixed links", () => {
    setup({ title: "title", items: [defaultLink, defaultRoute] });
    spec.detectChanges();

    expect(getLinks().length).toBe(2);
    assertExternalLink(0, defaultLink.label, defaultUri);
    assertInternalLink(1, defaultRoute);
  });
});
