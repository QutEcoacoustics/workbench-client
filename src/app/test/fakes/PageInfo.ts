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
    renderMode: modelData.helpers.arrayElement([
      RenderMode.Server,
      RenderMode.Client,
      RenderMode.Prerender,
    ]),
    ...data,
  };
}
