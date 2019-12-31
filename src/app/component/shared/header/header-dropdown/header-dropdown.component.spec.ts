import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MenuLink, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { HeaderDropdownComponent } from "./header-dropdown.component";

describe("HeaderDropdownComponent", () => {
  let component: HeaderDropdownComponent;
  let fixture: ComponentFixture<HeaderDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderDropdownComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDropdownComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.links = {
      headerTitle: "test",
      items: [{ kind: "MenuLink", label: "label", uri: "uri" } as MenuLink]
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should create header title", () => {
    component.links = {
      headerTitle: "Custom Title",
      items: [{ kind: "MenuLink", label: "label", uri: "uri" } as MenuLink]
    };
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("button");
    expect(title).toBeTruthy();
    expect(title.innerText.trim()).toBe("Custom Title");
  });

  it("should default as inactive state", () => {
    component.links = {
      headerTitle: "test",
      items: [{ kind: "MenuLink", label: "label", uri: "uri" } as MenuLink]
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
      items: [{ kind: "MenuLink", label: "label", uri: "uri" } as MenuLink]
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
        {
          kind: "MenuRoute",
          label: "Custom Label",
          route: StrongRoute.Base.add("home")
        } as MenuRoute
      ]
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
        {
          kind: "MenuRoute",
          label: "Custom Label 1",
          route: StrongRoute.Base.add("home")
        } as MenuRoute,
        {
          kind: "MenuRoute",
          label: "Custom Label 2",
          route: StrongRoute.Base.add("house")
        } as MenuRoute
      ]
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
        {
          kind: "MenuLink",
          label: "Custom Label",
          uri: "http://brokenlink/"
        } as MenuLink
      ]
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
        {
          kind: "MenuLink",
          label: "Custom Label 1",
          uri: "http://brokenlink/1"
        } as MenuLink,
        {
          kind: "MenuLink",
          label: "Custom Label 2",
          uri: "http://brokenlink/2"
        } as MenuLink
      ]
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
        {
          kind: "MenuLink",
          label: "Custom Label 1",
          uri: "http://brokenlink/1"
        } as MenuLink,
        {
          kind: "MenuRoute",
          label: "Custom Label 2",
          route: StrongRoute.Base.add("house")
        } as MenuRoute
      ]
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
