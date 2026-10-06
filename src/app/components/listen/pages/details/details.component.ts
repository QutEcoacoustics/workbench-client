import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import {
  listenCategory,
  listenRecordingMenuItem,
} from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AudioRecording } from "@models/AudioRecording";
import { BawClientComponent } from "@shared/baw-client/baw-client.component";

// The duration of audio the old client loads from the start time //
const listenWindowSeconds = 30;

@Component({
  selector: "baw-listen-recording",
  template: "<baw-client></baw-client>",
  imports: [BawClientComponent],
})
class ListenRecordingComponent extends PageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    // the old client does not clamp user provided start times, so a start
    // time near the end of the recording requests media past its end
    const recording = retrieveResolvedModel(
      this.route.snapshot.data as IPageInfo,
      AudioRecording,
    );
    const duration = recording?.durationSeconds;
    const start = Number(this.route.snapshot.queryParams["start"]);

    if (start + listenWindowSeconds > duration!) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          start: Math.max(0, Math.floor(duration! - listenWindowSeconds)),
        },
        queryParamsHandling: "merge",
        replaceUrl: true,
      });
    }
  }
}

ListenRecordingComponent.linkToRoute({
  category: listenCategory,
  pageRoute: listenRecordingMenuItem,
  fullscreen: true,
  resolvers: { audioRecording: audioRecordingResolvers.show },
});

export { ListenRecordingComponent };
