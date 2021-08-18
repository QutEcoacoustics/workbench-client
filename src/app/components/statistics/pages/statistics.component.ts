import { Component, OnInit } from "@angular/core";
import { StatisticsService } from "@baw-api/statistics/statistics.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { toRelative } from "@interfaces/apiInterfaces";
import { StatisticsRecent } from "@models/Statistics";
import { ConfigService } from "@services/config/config.service";
import { IItem } from "@shared/items/item/item.component";
import fileSize from "filesize";
import { List, Map } from "immutable";
import { takeUntil } from "rxjs/operators";
import { defaultAudioIcon, defaultUserIcon } from "src/app/app.menus";
import { statisticsCategory, statisticsMenuItem } from "../statistics.menus";

function item(data: IItem): Map<keyof IItem, any> {
  return Map<keyof IItem, any>(data);
}

/**
 * Statistics Component
 *
 * TODO Change statistics based on if config hideProjects property is set
 */
@Component({
  selector: "baw-statistics",
  template: `
    <h1>Statistics</h1>

    <baw-items [items]="getGroupOne()"></baw-items>
    <baw-items [items]="getGroupTwo()"></baw-items>

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
  private groupOne = {
    projects: item({ name: "Projects", icon: ["fas", "home"] }),
    annotations: item({ name: "Annotations", icon: ["fas", "bullseye"] }),
    tags: item({ name: "Available tags", icon: ["fas", "tags"] }),
    sites: item({ name: "Sites", icon: ["fas", "map-marker-alt"] }),
    recordings: item({ name: "Audio recordings", icon: defaultAudioIcon }),
    users: item({ name: "Users", icon: defaultUserIcon }),
  };

  private groupTwo = {
    uniqueTags: item({
      icon: ["fas", "tags"],
      name: "Unique tags attached to annotations",
    }),
    tagsApplied: item({
      icon: ["fas", "tags"],
      name: "Tags attached to annotations",
    }),
    newAnnotations: item({
      icon: ["fas", "bullseye"],
      name: "New annotations in the last month",
    }),
    annotationDuration: item({
      icon: ["fas", "clock"],
      name: "Overall annotation duration",
    }),
    users: item({ icon: defaultUserIcon, name: "Users Online" }),
    storedData: item({
      icon: defaultAudioIcon,
      name: "Overall audio recording file size",
    }),
    newRecordings: item({
      icon: defaultAudioIcon,
      name: "New audio recordings in last month",
    }),
    audioDuration: item({
      icon: ["fas", "clock"],
      name: "Overall audio duration",
    }),
  };

  public recent: StatisticsRecent;

  public constructor(
    private stats: StatisticsService,
    private config: ConfigService
  ) {
    super();
  }

  public ngOnInit() {
    this.stats
      .show()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ summary, recent }) => {
        const groupOne = this.groupOne;
        const groupTwo = this.groupTwo;

        function setGroupOneValue(
          key: keyof typeof groupOne,
          value: string | number
        ) {
          groupOne[key] = groupOne[key].set("value", value);
        }

        function setGroupTwoValue(
          key: keyof typeof groupTwo,
          value: string | number
        ) {
          groupTwo[key] = groupTwo[key].set("value", value);
        }

        setGroupOneValue("projects", summary.projectsTotal);
        setGroupOneValue("annotations", summary.annotationsTotal);
        setGroupOneValue("tags", summary.tagsTotal);
        setGroupOneValue("sites", summary.sitesTotal);
        setGroupOneValue("recordings", summary.audioRecordingsTotal);
        setGroupOneValue("users", summary.usersTotal);

        setGroupTwoValue("uniqueTags", summary.tagsAppliedUniqueTotal);
        setGroupTwoValue("tagsApplied", summary.tagsAppliedTotal);
        setGroupTwoValue("newAnnotations", recent.audioEventIds.size);
        setGroupTwoValue(
          "annotationDuration",
          toRelative(summary.annotationsTotalDuration, { largest: 2 })
        );
        setGroupTwoValue("users", summary.usersOnline);
        setGroupTwoValue(
          "storedData",
          fileSize(summary.audioRecordingsTotalSize, { round: 2 })
        );
        setGroupTwoValue("newRecordings", summary.audioRecordingsRecent);
        setGroupTwoValue(
          "audioDuration",
          toRelative(summary.audioRecordingsTotalDuration, {
            largest: 2,
          })
        );

        this.recent = recent;
      });
  }

  public getGroupOne(): List<IItem> {
    return List<IItem>(
      Object.keys(this.groupOne).map((key) => this.groupOne[key].toObject())
    );
  }

  public getGroupTwo(): List<IItem> {
    return List<IItem>(
      Object.keys(this.groupTwo).map((key) => this.groupTwo[key].toObject())
    );
  }
}

StatisticsComponent.linkComponentToPageInfo({
  category: statisticsCategory,
}).andMenuRoute(statisticsMenuItem);

export { StatisticsComponent };
