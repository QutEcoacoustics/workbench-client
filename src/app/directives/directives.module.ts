import { NgModule } from "@angular/core";
import { DatatableDirective } from "./datatable/datatable.directive";
import { ImageDirectiveModule } from "./image/image.module";

const directives = [DatatableDirective];

/**
 * App Shared Directives
 */
@NgModule({
  declarations: directives,
  imports: [ImageDirectiveModule],
  exports: [...directives, ImageDirectiveModule],
})
export class DirectivesModule {}
