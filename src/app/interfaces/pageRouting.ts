import { Type } from "@angular/core";
import { Route } from "@angular/router";
import { ActionMenuComponent } from "../component/shared/action-menu/action-menu.component";
import { SecondaryMenuComponent } from "../component/shared/secondary-menu/secondary-menu.component";
import { getPageInfo } from "./pageComponent";

/**
 * Dynamically create routes for an angular component
 * @param page Angular component page info
 * @returns List of routes
 */
export function GetRouteConfigForPage(
  component: Type<any>,
  config: Partial<Route>
) {
  const page = getPageInfo(component);

  if (!page) {
    return;
  }

  Object.assign(config, {
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
  });
}
