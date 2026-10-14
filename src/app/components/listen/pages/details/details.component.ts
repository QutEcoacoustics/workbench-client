import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import {
  listenCategory,
  listenRecordingMenuItem,
} from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { BawClientComponent } from "@shared/baw-client/baw-client.component";

@Component({
  selector: "baw-listen-recording",
  template: "<baw-client></baw-client>",
  imports: [BawClientComponent],
})
class ListenRecordingComponent extends PageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    // clamp listen urls that users type in themselves
    const { params, queryParams, data } = this.route.snapshot;
    const clampedParams = listenRecordingMenuItem.route.queryParams(
      { ...params, ...queryParams },
      retrieveResolvers(data as IPageInfo),
    );

    const requestedEnd = Number(queryParams["end"] ?? Infinity);
    if (clampedParams["end"] < requestedEnd) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { end: clampedParams["end"] },
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
