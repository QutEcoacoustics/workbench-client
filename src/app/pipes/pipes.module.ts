import { NgModule } from "@angular/core";
import { IsUnresolvedPipe } from "./isUnresolved/is-unresolved.pipe";
import { ToRelativePipe } from "./toRelative/to-relative.pipe";

const pipes = [IsUnresolvedPipe, ToRelativePipe];

@NgModule({ declarations: pipes, exports: pipes })
export class PipesModule {}
