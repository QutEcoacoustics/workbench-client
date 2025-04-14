import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { UrlActiveDirective } from "./url-active.directive";
import { UrlDirective } from "./url.directive";

@Component({
  template: `
    <a
      [bawUrl]="url"
      [bawUrlActive]="klass"
      [bawUrlActiveOptions]="activeOptions"
    >
      Link
    </a>
  `,
})
class MockComponent {
  @Input() public url: string;
  @Input() public klass: string;
  @Input() public activeOptions: { exact: boolean };
}

describe("UrlActiveDirective", () => {
  let router: Router;
  let spec: Spectator<MockComponent>;
  const specialRoute = "home";
  const createDirective = createComponentFactory({
    component: MockComponent,
    declarations: [UrlDirective, UrlActiveDirective],
    imports: [
      RouterTestingModule.withRoutes([
        { path: "", pathMatch: "full", component: MockComponent },
        { path: specialRoute, component: MockComponent },
      ]),
    ],
  });

  function setup(
    url: string,
    klass: string,
    activeOptions?: { exact: boolean }
  ) {
    spec = createDirective({ props: { url, klass, activeOptions } });
    router = spec.inject(Router);
    router.initialNavigation();
  }

  async function changeRoute(url: string) {
    await router.navigate([url]);
  }

  function getDirective() {
    return spec.query(UrlActiveDirective);
  }

  function getLink() {
    return spec.element.querySelector("a");
  }

  it("should not set class when url does not match", () => {
    setup("/home", "active");
    expect(getLink()).not.toHaveClass("active");
  });

  it("should set class when url matches", async () => {
    setup(`/${specialRoute}`, "active");
    await changeRoute(specialRoute);
    expect(getLink()).toHaveClass("active");
  });

  it("should accept active options", () => {
    setup("/home", "active", { exact: true });
    expect(getDirective().routerLinkActiveOptions).toEqual({ exact: true });
  });
});
