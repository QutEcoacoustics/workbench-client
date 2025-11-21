import { inject, Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";
import { titleCase } from "@helpers/case-converter/case-converter";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { MenuRoute, TitleOptionsHash } from "@interfaces/menusInterfaces";
import { ConfigService } from "@services/config/config.service";

@Injectable({ providedIn: "root" })
export class PageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly config = inject(ConfigService);

  private routerState: RouterStateSnapshot;

  /**
   * Recursively builds the title from the page route and its parent routes
   *
   * @param subRoute A page route to construct the title for
   * @returns A title of the route and its parents constructed in the format " | parent | subRoute"
   */
  private buildHierarchicalTitle(subRoute: MenuRoute): string {
    // If the page route has an explicit way to construct the title, use the title callback
    // if there is no `title` callback defined in the menuRoute, use the category label as a fallback
    let componentTitle = "";

    if (subRoute?.title) {
      // in the rare case that the title callback throws an error, the category label should be used as a fallback
      try {
        const hideProjects: boolean = this.config.settings.hideProjects;
        const titleOptions: TitleOptionsHash = { hideProjects };

        const routeFragmentTitle = subRoute.title(
          this.routerState,
          titleOptions
        );

        // to explicitly omit a route title fragment, the title callback will return null
        if (isInstantiated(routeFragmentTitle)) {
          componentTitle = " | " + routeFragmentTitle;
        }
      } catch (error: unknown) {
        componentTitle = titleCase(subRoute.label);
        console.error(`Failed to resolve title callback ${error}`);
      }
    } else {
      // since category labels are not title cased (first letter after space capitalized), we need to title case them
      // since explicit route titles commonly include model names which are case sensitive, explicit titles should not change casing
      // e.g. Project name "Tasmanian wetlands" != "Tasmanian Wetlands" as the user has explicitly not capitalized "Wetlands"
      componentTitle = " | " + titleCase(subRoute.label);
    }

    return subRoute?.parent
      ? this.buildHierarchicalTitle(subRoute.parent) + componentTitle
      : componentTitle;
  }

  // all site titles should follow the format <<brandName>> | ...PageComponentTitles
  // e.g. Ecosounds | Projects | Cooloola | Audio Recordings | 261658
  public override updateTitle(newRouterState: RouterStateSnapshot): void {
    this.routerState = newRouterState;
    const brandName = this.config.settings.brand.short;

    const rootPageRoute = this.routerState.root.firstChild;
    const newTitle = this.buildHierarchicalTitle(rootPageRoute.data.pageRoute);

    this.title.setTitle(brandName + newTitle);
  }
}
