import { Route, Routes } from "@angular/router";
import { ResolverHandlerComponent } from "@components/error/resolver-handler.component";
import { FormTouchedGuard } from "@guards/form/form.guard";
import { NavigationConfirmationGuard } from "@guards/confirmation/confirmation.guard";
import { Option } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { StrongRoute } from "@interfaces/strongRoute";
import { UnsavedInputGuard } from "@guards/input/input.guard";
import { RenderMode, ServerRoute } from "@angular/ssr";
import { getPageInfos } from "./pageComponent";

export function splitIndexedStrongRoutes(
  routes: Record<string, StrongRoute>,
): StrongRoute[] {
  return Object.values(routes).flat();
}

export function compileAndSplitRoutes(
  strongRoutes: StrongRoute[],
): [Routes, ServerRoute[]] {
  const clientRoutes = strongRoutes
    .flatMap((route) => route.compileRoutes(createClientRoute))

  const serverRoutes = strongRoutes
    .flatMap((route) => route.compileRoutes(createServerRoute));

  return [clientRoutes, serverRoutes];
}

/**
 * Dynamically create client routes for an angular component
 *
 * @param page Angular component page info
 * @returns List of routes
 */
function createClientRoute(strongRoute: StrongRoute): Option<Route> {
  const component = strongRoute.pageComponent;
  const config = strongRoute.angularRouteConfig;
  const pageInfo = getPageInfos(component)?.find(
    (info) => info.route === strongRoute,
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
        canDeactivate: [
          FormTouchedGuard,
          UnsavedInputGuard,
          NavigationConfirmationGuard,
        ],
      },
      {
        path: "",
        pathMatch: "full",
        outlet: "error",
        component: ResolverHandlerComponent,
      },
    ],
  };
}

function createServerRoute(strongRoute: StrongRoute): Option<ServerRoute> {
  const component = strongRoute.pageComponent;
  const config = strongRoute.angularRouteConfig;
  const pageInfo = getPageInfos(component)?.find(
    (info) => info.route === strongRoute,
  );

  if (!pageInfo || !isInstantiated(pageInfo.route.pathFragment)) {
    return null;
  }

  // by default, we want to render the page on the server
  const renderMode = pageInfo.renderMode ?? RenderMode.Server;

  return {
    path: config.path,
    renderMode,
  } as ServerRoute;
}
