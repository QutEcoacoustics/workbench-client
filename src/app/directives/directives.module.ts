import { NgModule } from "@angular/core";
import { DatatableDirective } from "./datatable/datatable.directive";
import { AuthenticatedImageDirectiveModule } from "./image/image.module";

const directives = [DatatableDirective];

/**
 * App Shared Directives
 */
@NgModule({
  declarations: directives,
  imports: [AuthenticatedImageDirectiveModule],
  exports: [...directives, AuthenticatedImageDirectiveModule],
})
export class DirectivesModule {}
