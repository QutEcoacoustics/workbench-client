import { Params } from "@angular/router";
import { homeCategory } from "@components/home/home.menus";
import { Category, menuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";

export const dataRequestRoute = StrongRoute.newRoot().add(
  "data_request",
  (params: Params) => ({
    // Handle params from workbench-client and baw-client
    userId: params?.userId ?? params?.selected_user_id,
    projectId: params?.projectId ?? params?.selected_project_id,
    regionId: params?.regionId,
    siteId: params?.siteId ?? params?.selected_site_id,
    timezoneName: params?.timezoneName ?? params?.selected_timezone_name,
  })
);

export const dataRequestCategory: Category = homeCategory;

export const dataRequestMenuItem = menuRoute({
  icon: ["fas", "table"],
  label: "Data Request",
  route: dataRequestRoute,
  tooltip: () => "Request customized data from the website",
  order: 7,
});
