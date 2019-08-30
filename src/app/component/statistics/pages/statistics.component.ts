import { Component, OnInit } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Site } from "src/app/models/Site";
import { User } from "src/app/models/User";
import { statisticsCategory, statisticsMenuItem } from "../statistics.menus";

@Page({
  category: statisticsCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: statisticsMenuItem
})
@Component({
  selector: "app-data-request",
  templateUrl: "./statistics.component.html",
  styleUrls: ["./statistics.component.scss"]
})
export class StatisticsComponent extends PageComponent implements OnInit {
  groupOne: { icon: IconProp; name: string; value: string | number }[];
  groupTwo: { icon: IconProp; name: string; value: string | number }[];
  recentAnnotations: Annotation[] | AnnotationExpanded[];
  recentRecordings: Recording[] | RecordingExpanded[];

  constructor() {
    super();
  }

  ngOnInit() {
    this.groupOne = [
      {
        icon: ["fas", "home"],
        name: "Projects",
        value: "Unknown"
      },
      {
        icon: ["fas", "bullseye"],
        name: "Annotations",
        value: "Unknown"
      },
      {
        icon: ["fas", "tags"],
        name: "Available tags",
        value: "Unknown"
      },
      {
        icon: ["fas", "map-marker-alt"],
        name: "Sites",
        value: "Unknown"
      },
      {
        icon: ["fas", "file-audio"],
        name: "Audio recordings",
        value: "Unknown"
      },
      {
        icon: ["fas", "users"],
        name: "Users",
        value: "Unknown"
      }
    ];

    this.groupTwo = [
      {
        icon: ["fas", "tags"],
        name: "Unique tags attached to annotations",
        value: "Unknown"
      },
      {
        icon: ["fas", "tags"],
        name: "Tags attached to annotations",
        value: "Unknown"
      },
      {
        icon: ["fas", "bullseye"],
        name: "New annotations in the last month",
        value: "Unknown"
      },
      {
        icon: ["fas", "clock"],
        name: "Overall annotation duration",
        value: "Unknown"
      },
      {
        icon: ["fas", "users"],
        name: "Users Online",
        value: "Unknown"
      },
      {
        icon: ["fas", "file-audio"],
        name: "Overall audio recording file size",
        value: "Unknown"
      },
      {
        icon: ["fas", "file-audio"],
        name: "New audio recordings in last month",
        value: "Unknown"
      },
      {
        icon: ["fas", "clock"],
        name: "Overall audio duration",
        value: "Unknown"
      }
    ];

    this.recentAnnotations = [{ updated: "Unknown" }];

    this.recentRecordings = [{ duration: "Unknown", uploaded: "Unknown" }];
  }

  isExpanded(
    group:
      | Annotation[]
      | AnnotationExpanded[]
      | Recording[]
      | RecordingExpanded[]
  ): group is AnnotationExpanded[] | RecordingExpanded[] {
    return Object.values(group[0]).indexOf("site") > -1;
  }
}

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
