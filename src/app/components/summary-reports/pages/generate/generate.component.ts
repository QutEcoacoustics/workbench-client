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
import { generateProjectSummaryReportCategory, generateSummaryReportMenuItem } from "../../summary-report.menu";

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

const projectKey = "project";
@Component({
  selector: "baw-generate-summary-report",
  templateUrl: "./generate.component.html",
  styleUrls: ["./generate.component.scss"],
})
class GenerateSummaryReportComponent extends PageComponent {
  public constructor(
    public router: Router
  ) {
    super();
  }

  public model: ViewModel;
  public filters$: BehaviorSubject<Filters<AudioRecording>> = new BehaviorSubject({});

  protected recognizers: RecognizerRow[] = [
    {
      name: "Lances",
      description: "Created by lance"
    },
    {
      name: "BirdNet",
      description: "Avian bird recogniser"
    },
    {
      name: "Analysis Programs",
      description: "QUT Ecoacoustics"
    }
  ];

  protected sites: PointSiteRow[] = [
    {
      name: "Cluster",
      description: "test site"
    },
    {
      name: "Samford Wet A",
      description: "test description"
    }
  ];

  public submit(): void {
    this.router.navigateByUrl("/projects/1135/report");
  }
}

GenerateSummaryReportComponent.linkToRoute({
  category: generateProjectSummaryReportCategory,
  menus: {},
  pageRoute: generateSummaryReportMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { GenerateSummaryReportComponent }
