import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DatatableDirective } from "./datatable/datatable.directive";
import { AuthenticatedImageModule } from "./image/image.module";
import { StrongRouteActiveDirective } from "./strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "./strongRoute/strong-route.directive";
import { UrlActiveDirective } from "./url/url-active.directive";
import { UrlDirective } from "./url/url.directive";

const directives = [
  DatatableDirective,
  StrongRouteDirective,
  StrongRouteActiveDirective,
  UrlDirective,
  UrlActiveDirective,
];

/**
 * App Shared Directives
 */
@NgModule({
  declarations: directives,
  imports: [AuthenticatedImageModule, RouterModule.forChild([])],
  exports: [...directives, AuthenticatedImageModule],
})
export class DirectivesModule {}
