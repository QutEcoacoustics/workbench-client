import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MenuLink, MenuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { HeaderDropdownComponent } from "./header-dropdown.component";

describe("HeaderDropdownComponent", () => {
  let component: HeaderDropdownComponent;
  let fixture: ComponentFixture<HeaderDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderDropdownComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDropdownComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.links = {
      headerTitle: "test",
      items: [
        MenuLink({
          label: "label",
          uri: () => "uri",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
        }),
      ],
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should create header title", () => {
    component.links = {
      headerTitle: "Custom Title",
      items: [
        MenuLink({
          label: "label",
          uri: () => "uri",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
        }),
      ],
    };
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("button");
    expect(title).toBeTruthy();
    expect(title.innerText.trim()).toBe("Custom Title");
  });

  it("should default as inactive state", () => {
    component.links = {
      headerTitle: "test",
      items: [
        MenuLink({
          label: "label",
          uri: () => "uri",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
        }),
      ],
    };
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("button");
    expect(title).toBeTruthy();

    title.classList.forEach((cssClass: string) => {
      expect(cssClass).not.toBe("active");
    });
  });

  it("should handle active state", () => {
    component.links = {
      headerTitle: "test",
      items: [
        MenuLink({
          label: "label",
          uri: () => "uri",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
        }),
      ],
    };
    component.active = true;
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("button");
    expect(title).toBeTruthy();

    let isActive = false;
    title.classList.forEach((cssClass: string) => {
      if (cssClass === "active") {
        isActive = true;
      }
    });
    expect(isActive).toBeTrue();
  });

  it("should handle single internal link dropdown", () => {
    component.links = {
      headerTitle: "test",
      items: [
        MenuRoute({
          label: "Custom Label",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          route: StrongRoute.Base.add("home"),
        }),
      ],
    };
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0].innerText.trim()).toBe("Custom Label");
    expect(
      links[0].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy();
    expect(
      links[0].attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/home");
  });

  it("should handle multiple internal link dropdown", () => {
    component.links = {
      headerTitle: "test",
      items: [
        MenuRoute({
          label: "Custom Label 1",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          route: StrongRoute.Base.add("home"),
        }),
        MenuRoute({
          label: "Custom Label 2",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          route: StrongRoute.Base.add("house"),
        }),
      ],
    };
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(2);
    expect(links[0].innerText.trim()).toBe("Custom Label 1");
    expect(
      links[0].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy();
    expect(
      links[0].attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/home");
    expect(links[1].innerText.trim()).toBe("Custom Label 2");
    expect(
      links[1].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy();
    expect(
      links[1].attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/house");
  });

  it("should handle single external link dropdown", () => {
    component.links = {
      headerTitle: "test",
      items: [
        MenuLink({
          label: "Custom Label",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          uri: () => "http://brokenlink/",
        }),
      ],
    };
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0].href).toBe("http://brokenlink/");
    expect(links[0].innerText.trim()).toBe("Custom Label");
  });

  it("should handle multiple external link dropdown", () => {
    component.links = {
      headerTitle: "test",
      items: [
        MenuLink({
          label: "Custom Label 1",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          uri: () => "http://brokenlink/1",
        }),
        MenuLink({
          label: "Custom Label 2",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          uri: () => "http://brokenlink/2",
        }),
      ],
    };
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(2);
    expect(links[0].href).toBe("http://brokenlink/1");
    expect(links[0].innerText.trim()).toBe("Custom Label 1");
    expect(links[1].href).toBe("http://brokenlink/2");
    expect(links[1].innerText.trim()).toBe("Custom Label 2");
  });

  it("should handle mixed link dropdown", () => {
    component.links = {
      headerTitle: "test",
      items: [
        MenuLink({
          label: "Custom Label 1",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          uri: () => "http://brokenlink/1",
        }),
        MenuRoute({
          label: "Custom Label 2",
          icon: ["fas", "home"],
          tooltip: () => "tooltip",
          route: StrongRoute.Base.add("house"),
        }),
      ],
    };
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(2);
    expect(links[0].href).toBe("http://brokenlink/1");
    expect(links[0].innerText.trim()).toBe("Custom Label 1");
    expect(links[1].innerText.trim()).toBe("Custom Label 2");
    expect(
      links[1].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy();
    expect(
      links[1].attributes.getNamedItem("ng-reflect-router-link").value
    ).toBe("/house");
  });
});
