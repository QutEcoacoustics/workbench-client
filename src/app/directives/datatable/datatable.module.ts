import { NgModule } from "@angular/core";
import { DatatableSortKeyDirective } from "./sort-key.directive";
import { DatatableDefaultsDirective } from "./defaults.directive";
import { DatatablePaginationDirective } from "./pagination.directive";
import { VirtualDatatablePaginationDirective } from "./virtualDatatablePagination/virtualDatatablePagination.directive";

const directives = [
  DatatableDefaultsDirective,
  DatatablePaginationDirective,
  DatatableSortKeyDirective,
  VirtualDatatablePaginationDirective,
];

@NgModule({
  declarations: directives,
  exports: directives,
})
export class BawDatatableModule {}
