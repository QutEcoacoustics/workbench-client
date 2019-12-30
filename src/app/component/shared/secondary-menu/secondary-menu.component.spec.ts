import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { List } from "immutable";
import { BehaviorSubject } from "rxjs";
import { testAppInitializer } from "src/app/app.helper";
import { DefaultMenu } from "src/app/helpers/page/defaultMenus";
import { PageInfo, PageInfoInterface } from "src/app/helpers/page/pageInfo";
import {
  AnyMenuItem,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import { SharedModule } from "../shared.module";
import { SecondaryMenuComponent } from "./secondary-menu.component";

describe("SecondaryMenuComponent", () => {
  let component: SecondaryMenuComponent;
  let fixture: ComponentFixture<SecondaryMenuComponent>;
  const defaultLinks = DefaultMenu.contextLinks;

  it("should display menu title", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("h6");
    const icon = title.querySelector("fa-icon");
    expect(title).toBeTruthy();
    expect(icon).toBeFalsy();
    expect(title.innerText.trim()).toBe("MENU");
  });

  it("should handle default links", () => {
    class MockActivatedRoute {
      private route = StrongRoute.Base.add("/");

      public params = new BehaviorSubject<any>({});
      public data = new BehaviorSubject<PageInfoInterface>(
        new PageInfo(SecondaryMenuComponent, {
          self: {
            kind: "MenuRoute",
            label: "Custom Label",
            icon: ["fas", "question-circle"],
            tooltip: () => "Custom Tooltip",
            route: this.route
          },
          category: {
            label: "Custom Category",
            icon: ["fas", "home"],
            route: this.route
          },
          menus: {
            actions: List<AnyMenuItem>([]),
            links: List<NavigableMenuItem>([])
          }
        } as PageInfoInterface)
      );
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [SecondaryMenuComponent],
      providers: [
        ...testAppInitializer,
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // Number of elements should be the default links,
    // plus self link, plus menu title, minus 2 links which require authentication
    const menuElements = fixture.nativeElement.querySelectorAll("li.nav-item");
    expect(menuElements.length).toBe(defaultLinks.count() + 2 - 2);
  });

  xit("should handle single internal link", () => {});
  xit("should handle multiple internal links", () => {});
  xit("should handle single external link", () => {});
  xit("should handle multiple external links", () => {});
});
