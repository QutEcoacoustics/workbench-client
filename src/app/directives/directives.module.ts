import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BawDatatableModule } from "./datatable/datatable.module";
import { AuthenticatedImageDirective } from "./image/image.directive";
import { StrongRouteActiveDirective } from "./strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "./strongRoute/strong-route.directive";
import { UrlActiveDirective } from "./url/url-active.directive";
import { UrlDirective } from "./url/url.directive";

const directives = [
  AuthenticatedImageDirective,
  StrongRouteActiveDirective,
  StrongRouteDirective,
  UrlActiveDirective,
  UrlDirective,
];

/**
 * App Shared Directives.
 * Use MockDirectivesModule for unit tests instead of this
 */
@NgModule({
  imports: [RouterModule.forChild([]), ...directives],
  exports: [...directives, BawDatatableModule],
})
export class DirectivesModule {}
