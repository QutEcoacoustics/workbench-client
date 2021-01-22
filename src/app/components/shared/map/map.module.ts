import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";
import { RouterModule } from "@angular/router";
import { LoadingModule } from "@shared/loading/loading.module";
import { MapComponent } from "./map.component";

@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule, RouterModule, GoogleMapsModule, LoadingModule],
  exports: [MapComponent],
})
export class MapModule {}
