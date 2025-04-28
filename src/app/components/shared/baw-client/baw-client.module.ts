import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoadingModule } from "@shared/loading/loading.module";
import { BawClientComponent } from "./baw-client.component";

/**
 * Header Module
 */
@NgModule({
    imports: [CommonModule, RouterModule, LoadingModule, BawClientComponent],
    exports: [BawClientComponent],
})
export class BawClientModule {}
