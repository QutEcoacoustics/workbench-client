import { NgModule } from "@angular/core";
import { internalComponents, internalModules, sharedComponents, sharedModules } from "./shared.components";

/**
 * Shared Components Module
 */
@NgModule({
  declarations: [...internalComponents, ...sharedComponents],
  imports: internalModules,
  exports: [...sharedModules, ...sharedComponents],
})
export class SharedModule {}
