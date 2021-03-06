import { ComponentFixture } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { menuLink, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assertRoute } from "@test/helpers/html";
import { HeaderItemComponent } from "./header-item.component";

describe("HeaderItemComponent", () => {
  let component: HeaderItemComponent;
  let fixture: ComponentFixture<HeaderItemComponent>;
  let spec: Spectator<HeaderItemComponent>;
  const createComponent = createComponentFactory({
    component: HeaderItemComponent,
    imports: [RouterTestingModule],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    fixture = spec.fixture;
    component = spec.component;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle internal link", () => {
    component.link = menuRoute({
      label: "Custom Label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.newRoot().add("home"),
    });
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0].innerText.trim()).toBe("Custom Label");
  });

  it("internal link should have router link", () => {
    component.link = menuRoute({
      label: "Custom Label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.newRoot().add("home"),
    });
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    assertRoute(link, "/home");
  });

  it("internal link should have router link active attribute", () => {
    component.link = menuRoute({
      label: "Custom Label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      route: StrongRoute.newRoot().add("home"),
    });
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    expect(
      link.attributes.getNamedItem("ng-reflect-router-link-active")
    ).toBeTruthy();
    expect(
      link.attributes.getNamedItem("ng-reflect-router-link-active").value
    ).toBe("active");
  });

  it("should handle external link", () => {
    component.link = menuLink({
      label: "Custom Label",
      icon: ["fas", "home"],
      tooltip: () => "tooltip",
      uri: () => "http://brokenlink/",
    });
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0].href).toBe("http://brokenlink/");
    expect(links[0].innerText.trim()).toBe("Custom Label");
  });
});
