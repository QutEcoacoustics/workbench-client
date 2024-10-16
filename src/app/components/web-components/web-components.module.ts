import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { GridTileContentComponent } from "./grid-tile-content/grid-tile-content.component";

const modules = [
  // the grid tile content component is a standalone component
  // this is why I have imported it as a module
  GridTileContentComponent,
];

@NgModule({
  imports: [SharedModule, ...modules],
  exports: modules,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnnotationModule {}
