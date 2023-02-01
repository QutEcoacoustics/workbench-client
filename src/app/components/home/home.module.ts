import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { ProjectsModule } from "../projects/projects.module";
import { HomeComponent } from "./home.component";
import { homeRoute } from "./home.menus";

const components = [HomeComponent];
const routes = homeRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
    declarations: components,
    exports: [RouterModule, ...components],
    imports: [SharedModule, RouterModule.forChild(routes), ProjectsModule]
})
export class HomeModule {}
