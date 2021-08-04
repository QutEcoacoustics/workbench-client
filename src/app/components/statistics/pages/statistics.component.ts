import { Component, OnInit } from "@angular/core";
import { StatisticsService } from "@baw-api/statistics/statistics.service";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Site } from "@models/Site";
import { User } from "@models/User";
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
  public groupOne: List<{
    icon: IconProp;
    name: string;
    value: string | number;
  }>;
  public groupTwo: List<{
    icon: IconProp;
    name: string;
    value: string | number;
  }>;
  public recentAnnotations: Annotation[] | AnnotationExpanded[];
  public recentRecordings: Recording[] | RecordingExpanded[];

  public constructor(private stats: StatisticsService) {
    super();
  }

  public ngOnInit() {
    this.groupOne = List([
      {
        icon: ["fas", "home"],
        name: "Projects",
        value: "Unknown",
      },
      {
        icon: ["fas", "bullseye"],
        name: "Annotations",
        value: "Unknown",
      },
      {
        icon: ["fas", "tags"],
        name: "Available tags",
        value: "Unknown",
      },
      {
        icon: ["fas", "map-marker-alt"],
        name: "Sites",
        value: "Unknown",
      },
      {
        icon: defaultAudioIcon,
        name: "Audio recordings",
        value: "Unknown",
      },
      {
        icon: defaultUserIcon,
        name: "Users",
        value: "Unknown",
      },
    ]);

    this.groupTwo = List([
      {
        icon: ["fas", "tags"],
        name: "Unique tags attached to annotations",
        value: "Unknown",
      },
      {
        icon: ["fas", "tags"],
        name: "Tags attached to annotations",
        value: "Unknown",
      },
      {
        icon: ["fas", "bullseye"],
        name: "New annotations in the last month",
        value: "Unknown",
      },
      {
        icon: ["fas", "clock"],
        name: "Overall annotation duration",
        value: "Unknown",
      },
      {
        icon: defaultUserIcon,
        name: "Users Online",
        value: "Unknown",
      },
      {
        icon: defaultAudioIcon,
        name: "Overall audio recording file size",
        value: "Unknown",
      },
      {
        icon: defaultAudioIcon,
        name: "New audio recordings in last month",
        value: "Unknown",
      },
      {
        icon: ["fas", "clock"],
        name: "Overall audio duration",
        value: "Unknown",
      },
    ]);

    this.recentAnnotations = [{ updated: "Unknown" }];
    this.recentRecordings = [{ duration: "Unknown", uploaded: "Unknown" }];

    this.stats
      .show()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((results) => {
        console.log(results);

        this.groupOne.get(1).value = results.summary.annotationsTotal;
        this.groupOne.get(2).value = results.summary.tagsTotal;
        this.groupOne.get(4).value = results.summary.audioRecordingsTotal;
        this.groupOne.get(5).value = results.summary.usersTotal;

        this.groupTwo.get(0).value = results.summary.tagsAppliedTotal;
        this.groupTwo.get(2).value = results.recent.audioEventIds.size;
        this.groupTwo.get(3).value =
          results.summary.annotationsTotalDuration.toISO();
        this.groupTwo.get(4).value = results.summary.usersOnline;
        this.groupTwo.get(5).value = results.summary.audioRecordingsTotalSize;
        this.groupTwo.get(6).value = results.recent.audioRecordingIds.size;
        this.groupTwo.get(7).value =
          results.summary.audioRecordingsTotalDuration.toISO();
      });
  }

  public isExpanded(
    group:
      | Annotation[]
      | AnnotationExpanded[]
      | Recording[]
      | RecordingExpanded[]
  ): group is AnnotationExpanded[] | RecordingExpanded[] {
    return Object.values(group[0]).indexOf("site") > -1;
  }
}

StatisticsComponent.linkComponentToPageInfo({
  category: statisticsCategory,
}).andMenuRoute(statisticsMenuItem);

export { StatisticsComponent };

interface Annotation {
  tag?: string;
  updated: string;
}
interface AnnotationExpanded {
  site: Site;
  user: User;
  updated: string;
  tag: string;
}

interface Recording {
  duration: string;
  uploaded: string;
}

interface RecordingExpanded {
  site: Site;
  duration: string;
  uploaded: string;
}
