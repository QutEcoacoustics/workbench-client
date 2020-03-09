import { NgModule } from "@angular/core";
import { DatatableDirective } from "./datatable/datatable.directive";

const directives = [DatatableDirective];

@NgModule({
  declarations: directives,
  exports: directives
})
export class DirectivesModule {}
