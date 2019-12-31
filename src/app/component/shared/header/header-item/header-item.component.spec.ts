import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MenuLink, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { HeaderItemComponent } from "./header-item.component";

describe("HeaderItemComponent", () => {
  let component: HeaderItemComponent;
  let fixture: ComponentFixture<HeaderItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderItemComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderItemComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle internal link", () => {
    component.link = {
      kind: "MenuRoute",
      label: "Custom Label",
      route: StrongRoute.Base.add("home")
    } as MenuRoute;
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0].innerText.trim()).toBe("Custom Label");
  });

  it("internal link should have router link", () => {
    component.link = {
      kind: "MenuRoute",
      label: "Custom Label",
      route: StrongRoute.Base.add("home")
    } as MenuRoute;
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector("a");
    expect(link.attributes.getNamedItem("ng-reflect-router-link")).toBeTruthy();
    expect(link.attributes.getNamedItem("ng-reflect-router-link").value).toBe(
      "/home"
    );
  });

  it("internal link should have router link active attribute", () => {
    component.link = {
      kind: "MenuRoute",
      label: "Custom Label",
      route: StrongRoute.Base.add("home")
    } as MenuRoute;
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
    component.link = {
      kind: "MenuLink",
      label: "Custom Label",
      uri: "http://brokenlink/"
    } as MenuLink;
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0].href).toBe("http://brokenlink/");
    expect(links[0].innerText.trim()).toBe("Custom Label");
  });
});
