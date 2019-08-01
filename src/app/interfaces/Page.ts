import { Type } from "@angular/core";
import { PageInfo, ComponentWithPageInfo } from "./PageInfo";
import { Routes } from "@angular/router";
import { SecondaryMenuComponent } from "../component/shared/secondary-menu/secondary-menu.component";
import { ActionMenuComponent } from "../component/shared/action-menu/action-menu.component";



export function GetPageInfo(component: Type<any>) {
  const pageComponent = component as ComponentWithPageInfo;
  return pageComponent ? pageComponent.pageInfo : null;
}

// get pageInfo from each component
function* GetRoutes(components: Type<any>[]) {
  for (const component of components) {
    const page = GetPageInfo(component);
    if (page) {
      yield* GetRoutesForPage(page);
    }
  }
}

export function GetRoutesForPages(components) {
  return Array.from(GetRoutes(components));
}

export function GetRoutesForPage(page: PageInfo): Routes {
  return [
    {
      path: page.routeFragment,
      // data is inherited in child routes
      data: page,
      children: [
        {
          path: "",
          component: page.component,
        },
        {
          path: "",
          outlet: "secondary",
          component: SecondaryMenuComponent,
        },
        {
          path: "",
          outlet: "action",
          component: ActionMenuComponent,
        }
      ]
    }
  ];
}