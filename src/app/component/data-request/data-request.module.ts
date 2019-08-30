import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { DataRequestComponent } from "./data-request.component";
import { dataRequestRoute } from "./data-request.menus";

export const dataRequestComponents = [DataRequestComponent];

const routes = dataRequestRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [dataRequestComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...dataRequestComponents]
})
export class DataRequestModule {}
