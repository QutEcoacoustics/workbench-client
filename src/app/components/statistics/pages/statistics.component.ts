import { Component, OnInit } from "@angular/core";
import { StatisticsService } from "@baw-api/statistics/statistics.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { toRelative } from "@interfaces/apiInterfaces";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { ConfigService } from "@services/config/config.service";
import { IItem } from "@shared/items/item/item.component";
import { TableColumn } from "@swimlane/ngx-datatable";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";
import { defaultAudioIcon, defaultUserIcon } from "src/app/app.menus";
import { statisticsCategory, statisticsMenuItem } from "../statistics.menus";

/**
 * Statistics Component
 */
@Component({
  selector: "baw-statistics",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.scss"],
})
class StatisticsComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
  public columns: TableColumn[];

  public groupOne = List<IItem>([
    { icon: ["fas", "home"], name: "Projects" },
    { icon: ["fas", "bullseye"], name: "Annotations" },
    { icon: ["fas", "tags"], name: "Available tags" },
    { icon: ["fas", "map-marker-alt"], name: "Sites" },
    { icon: defaultAudioIcon, name: "Audio recordings" },
    { icon: defaultUserIcon, name: "Users" },
  ]);
  public groupTwo = List<IItem>([
    { icon: ["fas", "tags"], name: "Unique tags attached to annotations" },
    { icon: ["fas", "tags"], name: "Tags attached to annotations" },
    { icon: ["fas", "bullseye"], name: "New annotations in the last month" },
    { icon: ["fas", "clock"], name: "Overall annotation duration" },
    { icon: defaultUserIcon, name: "Users Online" },
    { icon: defaultAudioIcon, name: "Overall audio recording file size" },
    { icon: defaultAudioIcon, name: "New audio recordings in last month" },
    { icon: ["fas", "clock"], name: "Overall audio duration" },
  ]);
  public recentAnnotations: AudioEvent[];
  public recentRecordings: AudioRecording[];
  public isLoggedIn: boolean;

  public constructor(
    private stats: StatisticsService,
    private config: ConfigService
  ) {
    super();
  }

  public ngOnInit() {
    this.isLoggedIn = this.stats.isLoggedIn();

    this.columns = [{ name: "Tags" }, { name: "Updated" }];

    if (this.isLoggedIn) {
      this.columns = [{ name: "Site" }, { name: "User" }, ...this.columns];
    }

    const updateValue = (
      group: "groupOne" | "groupTwo",
      index: number,
      value: string | number
    ) => {
      const list: List<IItem> = this[group];
      this[group] = list.set(index, { ...list.get(index), value });
    };

    this.stats
      .show()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((results) => {
        updateValue("groupOne", 1, results.summary.annotationsTotal);
        updateValue("groupOne", 2, results.summary.tagsTotal);
        updateValue("groupOne", 4, results.summary.audioRecordingsTotal);
        updateValue("groupOne", 5, results.summary.usersTotal);

        updateValue("groupTwo", 0, results.summary.tagsAppliedTotal);
        updateValue("groupTwo", 2, results.recent.audioEventIds.size);
        updateValue(
          "groupTwo",
          3,
          toRelative(results.summary.annotationsTotalDuration)
        );
        updateValue("groupTwo", 4, results.summary.usersOnline);
        updateValue("groupTwo", 5, results.summary.audioRecordingsTotalSize);
        updateValue("groupTwo", 6, results.recent.audioRecordingIds.size);
        updateValue(
          "groupTwo",
          7,
          toRelative(results.summary.audioRecordingsTotalDuration)
        );

        this.recentAnnotations = results.recent.audioEvents;
        this.recentRecordings = results.recent.audioRecordings;
      });
  }
}

StatisticsComponent.linkComponentToPageInfo({
  category: statisticsCategory,
}).andMenuRoute(statisticsMenuItem);

export { StatisticsComponent };
