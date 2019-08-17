import { PageInfo } from "./PageInfo";
import { Type } from "@angular/core";

export interface PageComponentStatic
  extends
    Type<PageComponentInterface>,
    Type<any> {
  readonly pageInfo: PageInfo;
}

export interface PageComponentInterface {
  readonly pageInfo: PageInfo;
}

// this mixin is needed because typescript decorators
// do not mutate the type signature they are applied to.
// See https://github.com/Microsoft/TypeScript/issues/4881
// If they did, then we wouldn't need this shim, which
// currently needs to be extended from in every component!
export class PageComponent implements PageComponentInterface {
  static get pageInfo(): PageInfo {
    return null;
  }
  get pageInfo(): PageInfo {
    return null;
  }
}

/**
 * Get the page info interface of an angular component
 * @param component Angular component
 */
export function getPageInfo(component: Type<any>): (PageInfo | null) {
  let pageComponent = component as PageComponentStatic;
  return pageComponent ? pageComponent.pageInfo : null;
}
