import { RenderMode } from "@angular/ssr";
import { homeCategory, homeMenuItem } from "@components/home/home.menus";
import { IPageInfo } from "@helpers/page/pageInfo";
import { modelData } from "@test/helpers/faker";

export function generatePageInfo(data?: Partial<IPageInfo>): Required<IPageInfo> {
  return {
    fullscreen: modelData.datatype.boolean(),
    category: homeCategory,
    pageRoute: homeMenuItem,
    resolvers: {},
    menus: {},
    // We hard code the RenderMode to "Client" instead of using a random value
    // so that if (in the future) tests start using PageInfo/StrongRoute
    // routing, they will all have the same rendering strategy.
    //
    // By setting a constant value, we can ensure that if a test fails due to a
    // specific rendering strategy, they will fail consistently and predictably.
    renderMode: RenderMode.Client,
    ...data,
  };
}
