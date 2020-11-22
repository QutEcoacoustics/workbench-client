import { Type } from "@angular/core";
import { Route } from "@angular/router";
import { ResolverHandlerComponent } from "@components/error/resolver-handler.component";
import { FormTouchedGuard } from "@guards/form/form.guard";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { ActionMenuComponent } from "@shared/action-menu/action-menu.component";
import { SecondaryMenuComponent } from "@shared/secondary-menu/secondary-menu.component";
import { getPageInfo, PageComponent } from "./pageComponent";

/**
 * Dynamically create routes for an angular component
 *
 * @param page Angular component page info
 * @returns List of routes
 */
export function GetRouteConfigForPage(
  component: Type<PageComponent>,
  config: Partial<Route>
) {
  const page = getPageInfo(component);

  if (!page || !isInstantiated(page.route.fullRoute)) {
    return;
  }

  return {
    ...config, // data is inherited in child routes
    data: page,
    resolve: page.resolvers,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: page.component,
        canDeactivate: [FormTouchedGuard],
      },
      {
        path: "",
        pathMatch: "full",
        outlet: "secondary",
        component: SecondaryMenuComponent,
      },
      {
        path: "",
        pathMatch: "full",
        outlet: "action",
        component: ActionMenuComponent,
      },
      {
        path: "",
        pathMatch: "full",
        outlet: "error",
        component: ResolverHandlerComponent,
      },
    ],
  } as Route;
}
