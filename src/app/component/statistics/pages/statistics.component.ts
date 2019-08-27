import { Component, OnInit } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { List } from "immutable";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
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
        value: 148
      },
      {
        icon: ["fas", "bullseye"],
        name: "Annotations",
        value: 237542
      },
      {
        icon: ["fas", "tags"],
        name: "Available tags",
        value: 2852
      },
      {
        icon: ["fas", "map-marker-alt"],
        name: "Sites",
        value: 1784
      },
      {
        icon: ["fas", "file-audio"],
        name: "Audio recordings",
        value: 610665
      },
      {
        icon: ["fas", "users"],
        name: "Users",
        value: 1128
      }
    ];

    this.groupTwo = [
      {
        icon: ["fas", "tags"],
        name: "Unique tags attached to annotations",
        value: 1264
      },
      {
        icon: ["fas", "tags"],
        name: "Tags attached to annotations",
        value: 440426
      },
      {
        icon: ["fas", "bullseye"],
        name: "New annotations in the last month",
        value: 707
      },
      {
        icon: ["fas", "clock"],
        name: "Overall annotation duration",
        value: "1 week and 19 hours"
      },
      {
        icon: ["fas", "users"],
        name: "Users Online",
        value: 2
      },
      {
        icon: ["fas", "file-audio"],
        name: "Overall audio recording file size",
        value: "120TB"
      },
      {
        icon: ["fas", "file-audio"],
        name: "New audio recordings in last month",
        value: "19394"
      },
      {
        icon: ["fas", "clock"],
        name: "Overall audio duration",
        value: "57 years and 5 months"
      }
    ];

    this.recentAnnotations = [
      { updated: "about 8 hours ago" },
      { updated: "about 8 hours ago" },
      { updated: "about 8 hours ago" },
      { updated: "about 8 hours ago" },
      { updated: "about 8 hours ago" },
      { updated: "about 8 hours ago" },
      { updated: "about 8 hours ago" },
      { updated: "about 8 hours ago" }
    ];

    this.recentRecordings = [
      { duration: "1 minute", uploaded: "7 days ago" },
      { duration: "1 minute", uploaded: "7 days ago" },
      { duration: "1 minute", uploaded: "7 days ago" },
      { duration: "1 minute", uploaded: "7 days ago" },
      { duration: "1 minute", uploaded: "7 days ago" },
      { duration: "1 minute", uploaded: "7 days ago" },
      { duration: "1 minute", uploaded: "7 days ago" },
      { duration: "1 minute", uploaded: "7 days ago" }
    ];
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
