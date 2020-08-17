import { Component, OnInit } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { List } from "immutable";
import { defaultAudioIcon, defaultUserIcon } from "src/app/app.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Site } from "src/app/models/Site";
import { User } from "src/app/models/User";
import { statisticsCategory, statisticsMenuItem } from "../statistics.menus";

/**
 * Statistics Component
 */
@Component({
  selector: "app-data-request",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.scss"],
})
class StatisticsComponent extends PageComponent implements OnInit {
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

  constructor() {
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

StatisticsComponent.LinkComponentToPageInfo({
  category: statisticsCategory,
}).AndMenuRoute(statisticsMenuItem);

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
