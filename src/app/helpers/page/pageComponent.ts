import { Type } from "@angular/core";
import { Option } from "@helpers/advancedTypes";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { withUnsubscribe } from "../unsubscribe/unsubscribe";
import { IPageInfo, PageInfo } from "./pageInfo";

export interface IPageComponent {
  readonly pageInfos: PageInfo[];
}

export interface IPageComponentStatic extends Type<IPageComponent> {
  readonly pageInfos: PageInfo[];
}

export class PageComponent extends withUnsubscribe() implements IPageComponent {
  private static _pageInfos: PageInfo[];

  public static get pageInfos(): PageInfo[] {
    return this._pageInfos;
  }

  public get pageInfos(): PageInfo[] {
    return PageComponent.pageInfos;
  }

  /**
   * Creates and links the page info for the page component
   */
  public static linkToRouterWith(
    info: IPageInfo,
    menu: MenuRoute
  ): typeof PageComponent {
    const pageInfo = new PageInfo(info);
    pageInfo.setMenuRoute(this, menu);
    (this._pageInfos ??= []).push(pageInfo);
    return this;
  }
}

/**
 * Get the page info interface of an angular component
 *
 * @param component Angular component or null if not exists
 */
export function getPageInfos(
  component: Option<Type<IPageComponent>>
): Option<PageInfo[]> {
  const pageComponent = component as IPageComponentStatic;

  if (
    !(component?.prototype instanceof PageComponent) ||
    !isInstantiated(pageComponent.pageInfos)
  ) {
    return null;
  }

  return pageComponent.pageInfos;
}
