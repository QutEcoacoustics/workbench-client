import { Type } from "@angular/core";
import { PageInfo, PageComponentStatic, PageComponent } from "./PageInfo";
import { Routes, Route, Router } from "@angular/router";
import { SecondaryMenuComponent } from "../component/shared/secondary-menu/secondary-menu.component";
import { ActionMenuComponent } from "../component/shared/action-menu/action-menu.component";

/**
 * Get the page info interface of an angular component
 * @param component Angular component
 */
export function GetPageInfo(component: Type<any>) {
  const pageComponent = component as PageComponentStatic;
  return pageComponent ? pageComponent.pageInfo : null;
}

/**
 * Get pageInfo from each component
 * @param components List of angular component
 * @returns Iterator containing a list of routes
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
  const route = {
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
  };

  // cross bind route object back to pageInfo
  // NOTE: this doesn't work
  // FIXME: need to somehow register for route
  // configuration finish and then get back the
  // url tree and assign it back to `route` - the
  // name and type of route will probably have to change
  page.route = route;

  return [route];
}

/**
 * Update page info component uri values
 * @param router Router
 * @param components Page components to find
 */
export function UpdateUriForPages(router: Router, components: Type<any>[]) {
  components.forEach(component => {
    const page = GetPageInfo(component);

    if (page) {
      const uri = GetUriForPage(router, page);
      page.uri = uri;
      console.log(page);
    }
  });
}

/**
 * Get URI for a page component
 * @param router Router
 * @param page Page component to find
 */
function GetUriForPage(router: Router, page: PageInfo): string {
  const output = searchRoutes(router.config, page);
  const routeOutput = "/" + output.map(route => route.path).join("/");

  return routeOutput;
}

/**
 * Search routes to find the page component full route
 * @param routes Route Children
 * @param page Page component to find
 */
function searchRoutes(routes: Routes, page: PageInfo): Routes {
  let output: Routes = [];
  routes.forEach(route => {
    if (output.length > 0) {
      return;
    }

    if (route.data && route.data === page) {
      // Route identified
      output = [route];
      return output;
    } else {
      if (route.children) {
        // Search route children
        const res = searchRoutes(route.children, page);
        if (res.length > 0) {
          output = [route];
          output = output.concat(res);
        }
      }
    }
  });

  // This branch is empty
  if (!output) {
    console.error("Failed to find component: ", page);
    return null;
  }

  return output;
}
