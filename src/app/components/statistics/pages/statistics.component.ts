import { Component, OnInit } from "@angular/core";
import { StatisticsService } from "@baw-api/statistics/statistics.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { toRelative } from "@interfaces/apiInterfaces";
import { StatisticsRecent } from "@models/Statistics";
import { ConfigService } from "@services/config/config.service";
import { IItem } from "@shared/items/item/item.component";
import fileSize from "filesize";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";
import { defaultAudioIcon, defaultUserIcon } from "src/app/app.menus";
import { statisticsCategory, statisticsMenuItem } from "../statistics.menus";

/**
 * Statistics Component
 *
 * TODO Change statistics based on if config hideProjects property is set
 */
@Component({
  selector: "baw-statistics",
  template: `
    <h1>Statistics</h1>

    <baw-items [items]="groupOne"></baw-items>
    <baw-items [items]="groupTwo"></baw-items>

    <baw-recent-annotations
      [annotations]="recent?.audioEvents"
    ></baw-recent-annotations>

    <br />

    <baw-recent-audio-recordings
      [audioRecordings]="recent?.audioRecordings"
    ></baw-recent-audio-recordings>
  `,
})
class StatisticsComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
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
  public recent: StatisticsRecent;

  public constructor(
    private stats: StatisticsService,
    private config: ConfigService
  ) {
    super();
  }

  public ngOnInit() {
    const updateValues = (
      group: "groupOne" | "groupTwo",
      ...values: { index: number; value: string | number }[]
    ) => {
      let list: List<IItem> = this[group];
      values.forEach(({ value, index }) => {
        list = list.set(index, { ...list.get(index), value });
      });
      this[group] = list;
    };

    this.stats
      .show()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ summary, recent }) => {
        updateValues(
          "groupOne",
          { index: 0, value: summary.projectsTotal },
          { index: 1, value: summary.annotationsTotal },
          { index: 2, value: summary.tagsTotal },
          { index: 3, value: summary.sitesTotal },
          { index: 4, value: summary.audioRecordingsTotal },
          { index: 5, value: summary.usersTotal }
        );

        updateValues(
          "groupTwo",
          { index: 0, value: summary.tagsAppliedUniqueTotal },
          { index: 1, value: summary.tagsAppliedTotal },
          { index: 2, value: recent.audioEventIds.size },
          {
            index: 3,
            value: toRelative(summary.annotationsTotalDuration, { largest: 2 }),
          },
          { index: 4, value: summary.usersOnline },
          {
            index: 5,
            value: fileSize(summary.audioRecordingsTotalSize, { round: 2 }),
          },
          { index: 6, value: summary.audioRecordingsRecent },
          {
            index: 7,
            value: toRelative(summary.audioRecordingsTotalDuration, {
              largest: 2,
            }),
          }
        );

        this.recent = recent;
      });
  }
}

StatisticsComponent.linkComponentToPageInfo({
  category: statisticsCategory,
}).andMenuRoute(statisticsMenuItem);

export { StatisticsComponent };
