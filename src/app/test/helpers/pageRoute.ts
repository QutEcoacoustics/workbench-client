import { Type } from "@angular/core";
import { RouterStateSnapshot } from "@angular/router";
import { titleCase } from "@helpers/case-converter/case-converter";
import { getPageInfos, IPageComponent } from "@helpers/page/pageComponent";
import { IPageInfo, PageInfo } from "@helpers/page/pageInfo";
import { MenuRoute } from "@interfaces/menusInterfaces";

/**
 * Asserts that the specified page component has the correct page title when mounted at all locations
 *
 * @param componentType Page component to test
 * @param expectedPageTitles An array of titles expected at each page mounting point
 * @param modelState Optional model state to pass to the page component
 */
export function assertPageInfo<T>(
  componentType: Type<IPageComponent>,
  expectedPageTitles: string[] | string,
  modelState?: IRouteModel<T>,
) {
  describe("pageRoute", () => {
    const componentPageInfo: PageInfo[] = getPageInfos(componentType);
    const componentPageRoutes: MenuRoute[] = componentPageInfo.map((pageInfo: IPageInfo) => pageInfo.pageRoute);

    const mockRouteState: RouterStateSnapshot = Object({
      root: {
        firstChild: {
          data: {
            pageRoute: {
              route: {
                pageComponent: {
                  pageInfos: componentPageInfo,
                },
              },
            },
            ...modelState,
          },
        },
      },
    }) as RouterStateSnapshot;

    beforeAll(() => {
      if (typeof expectedPageTitles === "string") {
        // if one title is provided, assume that this title is used at all route locations
        expectedPageTitles = Array(componentPageInfo.length).fill(expectedPageTitles);
      }
    });

    it("should have page info", () => {
      expect(componentPageInfo).toBeDefined();
    });

    it("should have a page route", () => {
      expect(componentPageRoutes).toBeDefined();
    });

    // some pages have multiple mounting points (e.g. sites & points).
    // Therefore, it should be asserted that the correct page title is used when mounted at all locations
    componentPageRoutes.forEach((pageRoute: MenuRoute, i: number) => {
      const pageRoutePath = pageRoute.route.angularRouteConfig.path;

      // some page routes do not have a page title, therefore there is no use in an assertion of page title
      if (pageRoute.title) {
        it(`should use the correct page title for the route "/${pageRoutePath}"`, () => {
          const expectedTitle = expectedPageTitles[i];
          const observedTitle = pageRoute.title(mockRouteState);
          expect(observedTitle).toEqual(expectedTitle);
        });
      } else {
        it(`should use the correct fallback menu route label for the route "/${pageRoutePath}"`, () => {
          const expectedTitle = expectedPageTitles[i];
          const observedTitle = titleCase(pageRoute.label);
          expect(observedTitle).toEqual(expectedTitle);
        });
      }

      // all page routes should have a fallback in the case that the page does not have a title
      it(`should have a fallback menuRoute label for the route "/${pageRoutePath}"`, () => {
        expect(pageRoute.label).toBeInstanceOf(String);
      });

      // These tests do not assert that the title is constructed correctly at all route locations, only that the correct title is used
      // Assertions that the titleStrategy can construct the correct hierarchical title is located in the `app.component.spec.ts`
      // TODO: Add tests to assert that the correct hierarchical title is constructed at all route locations
    });
  });
}

interface IRouteModel<T> {
  [key: string]: {
    model: T;
  }
}
