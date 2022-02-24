import { NgModule } from "@angular/core";
import { IsGhostUserPipe } from "./is-ghost-user/is-ghost-user.pipe";
import { IsUnresolvedPipe } from "./is-unresolved/is-unresolved.pipe";
import { TimezonePipe } from "./timezone/timezone.pipe";
import { ToRelativePipe } from "./to-relative/to-relative.pipe";
import { WithLoadingPipe } from "./with-loading/with-loading.pipe";

const pipes = [
  IsGhostUserPipe,
  IsUnresolvedPipe,
  ToRelativePipe,
  TimezonePipe,
  WithLoadingPipe,
];

@NgModule({
  declarations: pipes,
  exports: pipes,
})
export class PipesModule {}
