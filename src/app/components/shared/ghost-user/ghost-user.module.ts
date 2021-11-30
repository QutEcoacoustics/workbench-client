import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { IconsModule } from "@shared/icons/icons.module";
import { GhostUserComponent } from "./ghost-user.component";

@NgModule({
  declarations: [GhostUserComponent],
  imports: [CommonModule, IconsModule, NgbTooltipModule],
  exports: [GhostUserComponent],
})
export class GhostUserModule {}
