import { RouterTestingModule } from "@angular/router/testing";
import { MenuLink, menuLink } from "@interfaces/menusInterfaces";
import { HeaderItem } from "@menu/primary-menu/primary-menu.component";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { modelData } from "@test/helpers/faker";
import { assertHref } from "@test/helpers/html";
import { HeaderDropdownComponent } from "./header-dropdown.component";

describe("HeaderDropdownComponent", () => {
  let defaultUri: string;
  let defaultLink: MenuLink;
  let spec: Spectator<HeaderDropdownComponent>;
  const createComponent = createComponentFactory({
    component: HeaderDropdownComponent,
    imports: [NgbDropdownModule, RouterTestingModule],
  });

  function setup(links: HeaderItem[], label = "Label") {
    spec = createComponent({
      detectChanges: false,
      props: { links, label },
    });
  }

  function getLinks() {
    return spec.queryAll<HTMLAnchorElement>("a");
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
  });

  it("should create header title", () => {
    setup([defaultLink], "Custom Title");
    spec.detectChanges();
    expect(spec.query("button")).toContainText("Custom Title");
  });

  it("should handle single external link", () => {
    setup([defaultLink]);
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
    setup(items);
    spec.detectChanges();

    expect(getLinks().length).toBe(2);
    items.forEach((item, index) => {
      assertExternalLink(index, item.label, uriList[index]);
    });
  });
});
