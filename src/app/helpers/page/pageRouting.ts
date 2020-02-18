import { Type } from "@angular/core";
import { Route } from "@angular/router";
import { ActionMenuComponent } from "src/app/component/shared/action-menu/action-menu.component";
import { SecondaryMenuComponent } from "src/app/component/shared/secondary-menu/secondary-menu.component";
import { CanDeactivateGuard } from "src/app/guards/can-deactivate/can-deactivate.guard";
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

  const routes: Route = {
    // data is inherited in child routes
    data: page,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: page.component,
        resolve: page.resolvers ? page.resolvers : {}
      },
      {
        path: "",
        pathMatch: "full",
        outlet: "secondary",
        component: SecondaryMenuComponent
      },
      {
        path: "",
        pathMatch: "full",
        outlet: "action",
        component: ActionMenuComponent
      }
    ]
  };

  if (page.canDeactivate) {
    routes.children[0].canDeactivate = [CanDeactivateGuard];
  }

  Object.assign(config, routes);
}
