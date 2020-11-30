import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { LoadingModule } from "@shared/loading/loading.module";
import { BawClientComponent } from "./baw-client.component";

/**
 * Header Module
 */
@NgModule({
  declarations: [BawClientComponent],
  imports: [CommonModule, RouterModule, NgbModule, LoadingModule],
  exports: [BawClientComponent],
})
export class BawClientModule {}
