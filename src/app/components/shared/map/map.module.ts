import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GoogleMapsModule } from "@angular/google-maps";
import { RouterModule } from "@angular/router";
import { LoadingModule } from "@shared/loading/loading.module";
import { MapComponent } from "./map.component";

@NgModule({
    imports: [CommonModule, RouterModule, GoogleMapsModule, LoadingModule, MapComponent],
    exports: [MapComponent],
})
export class MapModule {}
