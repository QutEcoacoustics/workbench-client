import { Component } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { Router } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { BehaviorSubject } from "rxjs";
import { Filters } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { IPageInfo } from "@helpers/page/pageInfo";
import { siteResolvers } from "@baw-api/site/sites.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { newReportCategory, reportMenuItems } from "../../../reports.menu";

interface ViewModel {
  sites: Site[];
  points: Site[];
  recognizers: AudioEventProvenance[];
  recognizerCutOff: number;
  charts: string[];
  eventsOfInterest: Tag[];
}

interface RecognizerRow {
  name: string;
  description: string;
}

interface PointSiteRow {
  name: string;
  description: string;
}

interface EventOfInterestRow {
  name: string;
  description: string;
}

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-new-summary-report",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"],
})
class NewEventReportComponent extends PageComponent {
  public constructor(public router: Router) {
    super();
  }

  public model: ViewModel;
  public filters$: BehaviorSubject<Filters<AudioRecording>> =
    new BehaviorSubject({});

  protected recognizers: RecognizerRow[] = [
    {
      name: "Lances",
      description: "Created by lance",
    },
    {
      name: "BirdNet",
      description: "Avian bird recogniser",
    },
    {
      name: "Analysis Programs",
      description: "QUT Ecoacoustics",
    },
  ];

  protected sites: PointSiteRow[] = [
    {
      name: "Cluster",
      description: "test site",
    },
    {
      name: "Samford Wet A",
      description: "test description",
    },
  ];

  public submit(): void {
    this.router.navigateByUrl("/projects/1135/reports/event-summary");
  }

  protected eventsOfInterest: EventOfInterestRow[] = [
    {
      name: "Corvus monedula",
      description: "jackdaw",
    },
    {
      name: "Corvus frugilegus",
      description: "rook",
    },
    {
      name: "Corvus corone",
      description: "hooded crow",
    },
    {
      name: "Corvus corax",
      description: "raven",
    }
  ];
}

function getPageInfo(
  subRoute: keyof typeof reportMenuItems.new
): IPageInfo {
  return {
    pageRoute: reportMenuItems.new[subRoute],
    category: newReportCategory,
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

NewEventReportComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { NewEventReportComponent };
