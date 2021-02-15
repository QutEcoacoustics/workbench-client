import { NgModule } from "@angular/core";
import { DatatableDirective } from "./datatable/datatable.directive";
import { AuthenticatedImageModule } from "./image/image.module";
import { StrongRouteDirective } from "./strongRoute/strong-route.directive";
import { UriDirective } from "./uri/uri.directive";

const directives = [DatatableDirective, StrongRouteDirective, UriDirective];

/**
 * App Shared Directives
 */
@NgModule({
  declarations: directives,
  imports: [AuthenticatedImageModule],
  exports: [...directives, AuthenticatedImageModule],
})
export class DirectivesModule {}
