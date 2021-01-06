import { Type } from "@angular/core";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { withUnsubscribe } from "../unsubscribe/unsubscribe";
import { IPageInfo, PageInfo } from "./pageInfo";

export interface IPageComponent {
  readonly pageInfo: PageInfo;
}

export interface IPageComponentStatic extends Type<IPageComponent> {
  readonly pageInfo: PageInfo;
}

export class PageComponent extends withUnsubscribe() implements IPageComponent {
  private static _pageInfo: PageInfo;

  public static get pageInfo(): PageInfo {
    return this._pageInfo as PageInfo;
  }

  public get pageInfo() {
    return PageComponent.pageInfo;
  }

  /**
   * Creates and links the page info for the page component
   */
  public static linkComponentToPageInfo(info: IPageInfo): typeof PageComponent {
    this._pageInfo = new PageInfo(info);
    return this;
  }

  /**
   * Sets the menu route for the page component, and updates it to link to the
   * page info
   */
  public static andMenuRoute(menu: MenuRoute): typeof PageComponent {
    if (!this._pageInfo) {
      throw new Error(
        "AndMenuRoute must be called after LinkComponentToPageInfo"
      );
    }

    this._pageInfo.setMenuRoute(this, menu);
    return this;
  }
}

/**
 * Get the page info interface of an angular component
 *
 * @param component Angular component or null if not exists
 */
export function getPageInfo(
  component: Option<Type<IPageComponent>>
): Option<PageInfo> {
  return (component as IPageComponentStatic)?.pageInfo ?? null;
}
