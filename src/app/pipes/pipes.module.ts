import { NgModule } from "@angular/core";
import { IsUnresolvedPipe } from "./isUnresolved/is-unresolved.pipe";

@NgModule({
  declarations: [IsUnresolvedPipe],
  exports: [IsUnresolvedPipe],
})
export class PipesModule {}
