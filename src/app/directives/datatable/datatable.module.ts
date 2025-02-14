import { NgModule } from "@angular/core";
import { DatatableSortKeyDirective } from "./sort-key/sort-key.directive";
import { DatatableDefaultsDirective } from "./defaults/defaults.directive";
import { DatatablePaginationDirective } from "./pagination/pagination.directive";
import { VirtualDatatablePaginationDirective } from "./virtualDatatablePagination/virtual-datatable-pagination.directive";

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
