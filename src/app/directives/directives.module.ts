import { NgModule } from "@angular/core";
import { DatatableDirective } from "./datatable/datatable.directive";
import { AuthenticatedImageModule } from "./image/image.module";
import { StrongRouteDirective } from "./strongRoute/strong-route.directive";

const directives = [DatatableDirective, StrongRouteDirective];

/**
 * App Shared Directives
 */
@NgModule({
  declarations: directives,
  imports: [AuthenticatedImageModule],
  exports: [...directives, AuthenticatedImageModule],
})
export class DirectivesModule {}
