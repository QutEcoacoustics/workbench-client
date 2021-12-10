import { Type } from "@angular/core";
import { Option } from "@helpers/advancedTypes";
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

  /** Links the page info to the page component */
  public static linkToRoute(info: IPageInfo): typeof PageComponent {
    const pageInfo = new PageInfo(info);
    pageInfo.setComponent(this);
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
  return pageComponent?.pageInfos ?? null;
}
