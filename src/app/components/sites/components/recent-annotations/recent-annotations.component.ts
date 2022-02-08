import { Component, Input, OnInit } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AudioEvent } from "@models/AudioEvent";
import { Site } from "@models/Site";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs";

@Component({
  selector: "baw-site-recent-annotations",
  templateUrl: "./recent-annotations.component.html",
})
export class RecentAnnotationsComponent
  extends withUnsubscribe()
  implements OnInit
{
  @Input() public site: Site;

  public recentAudioEvents: AudioEvent[];

  public constructor(
    private audioEventsApi: ShallowAudioEventsService,
    private notifications: ToastrService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.getAnnotations();
  }

  private getAnnotations(): void {
    this.audioEventsApi
      .filterBySite(
        { sorting: { orderBy: "updatedAt", direction: "desc" } },
        this.site
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (events) => {
          // Limit the selection of audio events by tagging count
          const maxTags = 10;
          let numTags = 0;
          this.recentAudioEvents = [];

          for (const event of events) {
            this.recentAudioEvents.push(event);
            // An event with no taggings will still show a (not tagged) tag
            numTags += Math.max(event.taggings.length, 1);

            if (numTags > maxTags) {
              return;
            }
          }
        },
        error: (err: ApiErrorDetails) => this.notifications.error(err.message),
      });
  }
}
