import { AgmCoreModule } from "@agm/core";
import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MapComponent } from "./map.component";

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    RouterModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule
  ],
  exports: [MapComponent]
})
export class MapModule {}
