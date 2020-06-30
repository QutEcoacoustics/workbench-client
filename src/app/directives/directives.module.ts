import { NgModule } from "@angular/core";
import { DatatableDirective } from "./datatable/datatable.directive";
import { SecuredImageDirective } from "./secured-image/secured-image.directive";

const directives = [DatatableDirective, SecuredImageDirective];

/**
 * App Shared Directives
 */
@NgModule({
  declarations: directives,
  exports: directives,
})
export class DirectivesModule {}
