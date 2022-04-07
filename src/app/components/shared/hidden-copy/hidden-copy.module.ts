import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { IconsModule } from "@shared/icons/icons.module";
import { ClipboardModule } from "ngx-clipboard";
import { HiddenCopyComponent } from "./hidden-copy.component";

@NgModule({
  declarations: [HiddenCopyComponent],
  imports: [CommonModule, ClipboardModule, NgbTooltipModule, IconsModule],
  exports: [HiddenCopyComponent],
})
export class HiddenCopyModule {}
