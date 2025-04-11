import { Route } from "@angular/router";
import { ResolverHandlerComponent } from "@components/error/resolver-handler.component";
import { FormTouchedGuard } from "@guards/form/form.guard";
import { Option } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { StrongRoute } from "@interfaces/strongRoute";
import { UnsavedInputGuard } from "@guards/input/input.guard";
import { getPageInfos } from "./pageComponent";

/**
 * Dynamically create routes for an angular component
 *
 * @param page Angular component page info
 * @returns List of routes
 */
export function getRouteConfigForPage(strongRoute: StrongRoute): Option<Route> {
  const component = strongRoute.pageComponent;
  const config = strongRoute.angularRouteConfig;
  const pageInfo = getPageInfos(component)?.find(
    (info) => info.route === strongRoute
  );

  if (!pageInfo || !isInstantiated(pageInfo.route.pathFragment)) {
    return null;
  }

  return {
    ...config, // data is inherited in child routes
    data: pageInfo,
    resolve: pageInfo.resolvers,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: pageInfo.component,
        canDeactivate: [FormTouchedGuard, UnsavedInputGuard],
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
