import { NgModule } from "@angular/core";
import { DatePipe } from "@angular/common";
import { IsGhostUserPipe } from "./is-ghost-user/is-ghost-user.pipe";
import { IsUnresolvedPipe } from "./is-unresolved/is-unresolved.pipe";
import { SafePipe } from "./safe/safe.pipe";
import { TimezonePipe } from "./timezone/timezone.pipe";
import { WithLoadingPipe } from "./with-loading/with-loading.pipe";
import { TimePipe } from "./time/time.pipe";
import { DateTimePipe } from "./date/date.pipe";
import { isInstantiatedPipe } from "./is-instantiated/is-instantiated.pipe";

const pipes = [
  IsGhostUserPipe,
  IsUnresolvedPipe,
  isInstantiatedPipe,
  SafePipe,
  TimezonePipe,
  WithLoadingPipe,
  TimePipe,
  DateTimePipe,
];

const providers = [
  DatePipe,
];

@NgModule({
    imports: [...pipes],
    exports: pipes,
    providers,
})
export class PipesModule {}
