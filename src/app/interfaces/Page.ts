import { Type } from "@angular/core";
import { PageInfo, ComponentWithPageInfo } from "./PageInfo";
import { Routes, Route } from "@angular/router";
import { SecondaryMenuComponent } from "../component/shared/secondary-menu/secondary-menu.component";
import { ActionMenuComponent } from "../component/shared/action-menu/action-menu.component";

/**
 * Get the page info interface of an angular component
 * @param component Angular component
 */
export function GetPageInfo(component: Type<any>) {
  const pageComponent = component as ComponentWithPageInfo;
  return pageComponent ? pageComponent.pageInfo : null;
}

/**
 * Get pageInfo from each component
 * @param components List of angular component
 * @returns Iterater containing a list of routes
 */
function* GetRoutes(components: Type<any>[]): IterableIterator<Route> {
  for (const component of components) {
    const page = GetPageInfo(component);
    if (page) {
      yield* GetRoutesForPage(page);
    }
  }
}

/**
 * Iterate through all components and generate a list of routes
 * @param components List of angular components
 * @returns List of routes
 */
export function GetRoutesForPages(components: Type<any>[]): Route[] {
  return Array.from(GetRoutes(components));
}

/**
 * Dynamically create routes for an angular component
 * @param page Angular compnent page info
 * @returns List of routes
 */
export function GetRoutesForPage(page: PageInfo): Routes {
  return [
    {
      path: page.routeFragment,
      // data is inherited in child routes
      data: page,
      children: [
        {
          path: "",
          component: page.component
        },
        {
          path: "",
          outlet: "secondary",
          component: SecondaryMenuComponent
        },
        {
          path: "",
          outlet: "action",
          component: ActionMenuComponent
        }
      ]
    }
  ];
}
