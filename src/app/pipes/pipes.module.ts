import { NgModule } from "@angular/core";
import { IsUnresolvedPipe } from "./isUnresolved/is-unresolved.pipe";
import { SpinnerPipe } from "./spinner/spinner.pipe";
import { ToRelativePipe } from "./toRelative/to-relative.pipe";

const pipes = [IsUnresolvedPipe, ToRelativePipe, SpinnerPipe];

@NgModule({ declarations: pipes, exports: pipes })
export class PipesModule {}
