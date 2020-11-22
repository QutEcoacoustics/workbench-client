import { NgModule } from "@angular/core";
import { LineTruncationDirective } from "ngx-line-truncation";
import {
  internalComponents,
  internalModules,
  sharedComponents,
  sharedModules,
} from "./shared.components";

/**
 * Shared Components Module
 */
@NgModule({
  declarations: internalComponents,
  imports: internalModules,
  exports: [...sharedModules, ...sharedComponents, LineTruncationDirective],
})
export class SharedModule {}
