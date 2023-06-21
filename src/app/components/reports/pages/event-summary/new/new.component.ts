import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { Site } from "@models/Site";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Filters } from "@baw-api/baw-api.service";
import { AudioRecording } from "@models/AudioRecording";
import { IPageInfo } from "@helpers/page/pageInfo";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import {
  regionResolvers,
  RegionsService,
} from "@baw-api/region/regions.service";
import {
  retrieveResolvers,
  hasResolvedSuccessfully,
} from "@baw-api/resolver-common";
import { IRegion, Region } from "@models/Region";
import { Project } from "@models/Project";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import {
  reportMenuItems,
  newReportCategory,
} from "@components/reports/reports.menu";
import { Tag } from "@models/Tag";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { Id } from "@interfaces/apiInterfaces";
import { EventSummaryReportParameters } from "../eventSummaryParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

interface IEventReportConditions {
  dateTime: Filters<AudioRecording>;
  regions: BehaviorSubject<Region[]>;
  sites: BehaviorSubject<Site[]>;
  provenances: BehaviorSubject<AudioEventProvenance[]>;
  recognizerCutOff: number;
  charts: BehaviorSubject<string[]>;
  eventsOfInterest: BehaviorSubject<Tag[]>;
}

@Component({
  selector: "baw-new-summary-report",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"],
})
class NewEventReportComponent extends PageComponent implements OnInit {
  public constructor(
    public route: ActivatedRoute,
    public router: Router,
    public sitesApi: SitesService,
    public regionsApi: RegionsService,
    public provenanceApi: AudioEventProvenanceService,
    public tagsApi: TagsService
  ) {
    super();
  }

  public project: Project;
  public region: Region;
  public site: Site;

  // TODO: remove this
  public filters$: BehaviorSubject<Filters<AudioRecording>> =
    new BehaviorSubject({});

  public model: IEventReportConditions = {
    dateTime: {},
    regions: new BehaviorSubject<Region[]>([]),
    sites: new BehaviorSubject<Site[]>([]),
    provenances: new BehaviorSubject<AudioEventProvenance[]>([]),
    recognizerCutOff: 0.8,
    charts: new BehaviorSubject<string[]>([]),
    eventsOfInterest: new BehaviorSubject<Tag[]>([]),
  };

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
  }

  public get siteNames(): string[] {
    let sites: Site[];
    if (this.project) {
      sites = this.project.sites;
    } else if (this.region) {
      sites = this.region.sites;
    } else {
      sites = [this.site];
    }

    return sites.map((site: Site) => site.name);
  }

  public get recognizers(): AudioEventProvenance[] {
    return [
      new AudioEventProvenance(generateAudioEventProvenance({ name: "human" })),
      new AudioEventProvenance(
        generateAudioEventProvenance({ name: "birdNet" })
      ),
      new AudioEventProvenance(generateAudioEventProvenance({ name: "raven" })),
      new AudioEventProvenance(
        generateAudioEventProvenance({ name: "Lance's" })
      ),
      new AudioEventProvenance(generateAudioEventProvenance({ name: "Crane" })),
    ];
  }

  public get recognizersNames(): string[] {
    return this.recognizers.map(
      (recognizer: AudioEventProvenance) => recognizer.name
    );
  }

  public get chartsNames(): string[] {
    return [
      "Sensor Point Map",
      "Species Accumulation Curve",
      "Species Composition Curve",
      "False Colour Spectrograms",
    ];
  }

  public generateReport(): void {
    const parameterModel = this.createSearchParametersDataModel();
    const queryStringParameters = parameterModel.toQueryString();
    this.router.navigateByUrl(
      `/projects/1135/reports/event-summary?${queryStringParameters}`
    );
  }

  public regionFormatter = (region: Region) => region.name;
  public regionsServiceListFilter = (
    regionName: string
  ): Observable<Region[]> => {
    const filter: Filters<IRegion> = {
      filter: {
        name: {
          contains: regionName,
        },
      },
    };

    return this.regionsApi.filter(filter, this.project);
  };

  public siteFormatter = (site: Site) => site.name;
  public sitesServiceListFilter = (siteName: string): Observable<Site[]> => {
    const filter: Filters<Site> = {
      filter: {
        name: {
          contains: siteName,
        },
      },
    };

    return this.sitesApi.filter(filter, this.project);
  };

  public provenanceFormatter = (provenance: AudioEventProvenance) =>
    provenance.name;
  public provenanceServiceListFilter = (
    provenanceName: string
  ): Observable<AudioEventProvenance[]> => {
    const filter: Filters<AudioEventProvenance> = {
      filter: {
        name: {
          contains: provenanceName,
        },
      },
    };

    return this.provenanceApi.filter(filter);
  };

  public chartsFormatter = (chart: string) => chart;
  public chartsFilter = (text: string): Observable<string[]> =>
    of(this.chartsNames.filter((chart) => chart.includes(text)));

  public eventsFormatter = (tag: Tag): string => tag.text;
  public eventsOfInterestFilter = (text: string): Observable<Tag[]> => {
    const filter: Filters<Tag> = {
      filter: {
        text: {
          contains: text,
        },
      },
    };

    return this.tagsApi.filter(filter);
  };

  protected get viewTitle(): string {
    if (this.site) {
      if (this.site.isPoint) {
        return `Point: ${this.site.name}`;
      }

      return `Site: ${this.site.name}`;
    } else if (this.region) {
      return `Site: ${this.region.name}`;
    }

    return `Project: ${this.project.name}`;
  }

  private createSearchParametersDataModel(): EventSummaryReportParameters {
    const regionIds: Id[] = this.model.regions.value.map((region) => region.id);
    const siteIds: Id[] = this.model.sites.value.map((site) => site.id);
    const provenanceIds: Id[] = this.model.provenances.value.map(
      (provenance) => provenance.id
    );
    const eventIds: Id[] = this.model.eventsOfInterest.value.map(
      (event) => event.id
    );

    return new EventSummaryReportParameters(
      regionIds,
      siteIds,
      provenanceIds,
      eventIds,
      this.model.recognizerCutOff,
      this.model.charts.value
    );
  }
}

function getPageInfo(subRoute: keyof typeof reportMenuItems.new): IPageInfo {
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
