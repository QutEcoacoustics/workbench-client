import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DatatableDirective } from "./datatable/datatable.directive";
import { DatatablePaginationDirective } from "./datatable/pagination.directive";
import { AuthenticatedImageDirective } from "./image/image.directive";
import { StrongRouteActiveDirective } from "./strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "./strongRoute/strong-route.directive";
import { UrlActiveDirective } from "./url/url-active.directive";
import { UrlDirective } from "./url/url.directive";

const directives = [
  AuthenticatedImageDirective,
  DatatableDirective,
  DatatablePaginationDirective,
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
  declarations: directives,
  imports: [RouterModule.forChild([])],
  exports: directives,
})
export class DirectivesModule {}
