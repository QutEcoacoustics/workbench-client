import { NgModule } from "@angular/core";
import { DatatableSortKeyDirective } from "./sort-key.directive";
import { DatatableDefaultsDirective } from "./defaults.directive";
import { DatatablePaginationDirective } from "./pagination.directive";

const directives = [
  DatatableDefaultsDirective,
  DatatablePaginationDirective,
  DatatableSortKeyDirective,
];

@NgModule({
  declarations: directives,
  exports: directives,
})
export class BawDatatableModule {}
