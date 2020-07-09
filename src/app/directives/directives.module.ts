import { NgModule } from "@angular/core";
import { DatatableDirective } from "./datatable/datatable.directive";
import { AuthenticatedImageModule } from "./image/image.module";

const directives = [DatatableDirective];

/**
 * App Shared Directives
 */
@NgModule({
  declarations: directives,
  imports: [AuthenticatedImageModule],
  exports: [...directives, AuthenticatedImageModule],
})
export class DirectivesModule {}
