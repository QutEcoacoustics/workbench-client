import { NgModule } from "@angular/core";
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
  imports: [...internalModules, ...internalComponents, ...sharedComponents],
  exports: [...sharedModules, ...sharedComponents],
})
export class SharedModule {}
