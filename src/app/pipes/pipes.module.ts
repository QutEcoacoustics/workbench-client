import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { IsGhostUserPipe } from "./is-ghost-user/is-ghost-user.pipe";
import { IsUnresolvedPipe } from "./is-unresolved/is-unresolved.pipe";
import { SafePipe } from "./safe/safe.pipe";
import { TimezonePipe } from "./timezone/timezone.pipe";
import { ToRelativePipe } from "./to-relative/to-relative.pipe";
import { WithLoadingPipe } from "./with-loading/with-loading.pipe";
import { TimePipe } from "./time/time.pipe";
import { DateTimePipe } from "./date/date.pipe";

const pipes = [
  IsGhostUserPipe,
  IsUnresolvedPipe,
  SafePipe,
  TimezonePipe,
  ToRelativePipe,
  WithLoadingPipe,
  TimePipe,
  DateTimePipe,
];

const providers = [
  DatePipe,
];

@NgModule({
  declarations: pipes,
  exports: pipes,
  providers,
})
export class PipesModule {}
