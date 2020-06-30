import { NgModule } from "@angular/core";
import { DatatableDirective } from "./datatable/datatable.directive";

const directives = [DatatableDirective];

/**
 * App Shared Directives
 */
@NgModule({
  declarations: directives,
  exports: directives,
})
export class DirectivesModule {}
