import { Type } from "@angular/core";
import { WithUnsubscribe } from "../unsubscribe/unsubscribe";
import { IPageInfo, PageInfo } from "./pageInfo";

export interface PageComponentInterface extends Type<PageComponentInterface> {
  readonly pageInfo: PageInfo;
}

export class PageComponent extends WithUnsubscribe() {
  public static WithInfo(info: IPageInfo) {
    const pageInfo = new PageInfo(this, info);

    // Define pageInfo property
    Object.defineProperty(this, "pageInfo", {
      configurable: false,
      get: () => pageInfo,
    });

    // Define static pageInfo property
    Object.defineProperty(this["prototype"], "pageInfo", {
      configurable: false,
      get: () => pageInfo,
    });
  }
}

/**
 * Get the page info interface of an angular component
 * @param component Angular component
 */
export function getPageInfo(component: Type<any>): PageInfo | null {
  const pageComponent = component as PageComponentInterface;
  return pageComponent ? pageComponent.pageInfo : null;
}
