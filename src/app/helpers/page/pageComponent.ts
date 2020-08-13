import { Type } from "@angular/core";
import { WithUnsubscribe } from "../unsubscribe/unsubscribe";
import { IPageInfo, PageInfo } from "./pageInfo";

export interface PageComponentInterface {
  readonly pageInfo: PageInfo;
}

export interface PageComponentStaticInterface extends Type<PageComponentInterface> {
  readonly pageInfo: PageInfo;
}

export class PageComponent extends WithUnsubscribe() implements PageComponentInterface {
  private static _pageInfo: PageInfo;

  public static get pageInfo(): PageInfo {
    return this._pageInfo;
  }

  public get pageInfo() {
    return PageComponent.pageInfo;
  }

  public static WithInfo(info: IPageInfo) {
    this._pageInfo = new PageInfo(this, info);
  }
}

/**
 * Get the page info interface of an angular component
 * @param component Angular component
 */
export function getPageInfo(component: Type<PageComponentInterface>): PageInfo | null {
  const pageComponent = component as PageComponentStaticInterface;
  return pageComponent ? pageComponent.pageInfo : null;
}
