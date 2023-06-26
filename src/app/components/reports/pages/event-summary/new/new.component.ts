import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { Site } from "@models/Site";
import { BehaviorSubject, Observable, of } from "rxjs";
import { Filters } from "@baw-api/baw-api.service";
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
import {
  reportMenuItems,
  reportCategories,
} from "@components/reports/reports.menu";
import { Tag } from "@models/Tag";
import { TagsService } from "@baw-api/tag/tags.service";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { Id } from "@interfaces/apiInterfaces";
import { id } from "@baw-api/api-common";
import { RouteParams } from "@interfaces/strongRoute";
import { AudioRecordingFilterModel } from "@shared/audio-recordings-filter/audio-recordings-filter.component";
import {
  BinSize,
  EventSummaryReportParameters,
  GraphType,
} from "../EventSummaryReportParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

interface IEventReportConditions {
  dateTime: BehaviorSubject<AudioRecordingFilterModel>;
  regions: BehaviorSubject<Region[]>;
  sites: BehaviorSubject<Site[]>;
  provenances: BehaviorSubject<AudioEventProvenance[]>;
  provenanceCutOff: number;
  charts: BehaviorSubject<string[]>;
  eventsOfInterest: BehaviorSubject<Tag[]>;
  binSize: BinSize;
}

@Component({
  selector: "baw-new-summary-report",
  templateUrl: "./new.component.html",
  styleUrls: ["./new.component.scss"],
})
class NewEventReportComponent extends PageComponent implements OnInit {
  public constructor(
    protected sitesApi: SitesService,
    protected regionsApi: RegionsService,
    protected provenanceApi: AudioEventProvenanceService,
    protected tagsApi: TagsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  public project: Project;
  public region: Region | null;
  public site: Site | null;

  public model: IEventReportConditions = {
    dateTime: new BehaviorSubject<AudioRecordingFilterModel>({}),
    regions: new BehaviorSubject<Region[]>([]),
    sites: new BehaviorSubject<Site[]>([]),
    provenances: new BehaviorSubject<AudioEventProvenance[]>([]),
    provenanceCutOff: 0.8,
    charts: new BehaviorSubject<string[]>([]),
    eventsOfInterest: new BehaviorSubject<Tag[]>([]),
    binSize: "month",
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

  public generateReport(): void {
    if (!this.isValidProvenanceCutOff()) {
      return;
    }

    const parameterModel = this.createSearchParametersDataModel();
    const queryStringParameters = parameterModel.toQueryString();

    this.router.navigateByUrl(
      this.viewReportUrl() + `?${queryStringParameters}`
    );
  }

  // while this could be generalised, I have chosen not to as it'd lose a lot of strong type safety without the use of generics
  // as we are using these formatters in ng html templates, it is not possible to use TypeScript generics to enfore type safety
  // on a generalised function
  public regionFormatter = (region: Region) => region.name;
  public siteFormatter = (site: Site) => site.name;
  public provenanceFormatter = (provenance: AudioEventProvenance) =>
    provenance.name;
  public chartsFormatter = (chart: string) => chart;
  public eventsOfInterestFormatter = (tag: Tag): string => tag.text;

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

  public chartsFilter = (text: string): Observable<string[]> =>
    of(this.availableCharts.filter((chart) => chart.includes(text)));

  protected isValidProvenanceCutOff(): boolean {
    return this.model.provenanceCutOff >= 0 && this.model.provenanceCutOff <= 1;
  }

  protected get viewTitle(): string {
    if (this.site) {
      return this.site.isPoint ?
        `Point: ${this.site.name}`:
        `Site: ${this.site.name}`;
    } else if (this.region) {
      return `Site: ${this.region.name}`;
    }

    // it can be assumed that all reports will be generated from at least at the project level
    // therefore, if no sites or regions are specified, we can assume that the report is being generated at the project level
    return `Project: ${this.project.name}`;
  }

  private get availableCharts(): GraphType[] {
    return [
      "Sensor Point Map",
      "Species Accumulation Curve",
      "Species Composition Curve",
      "False Colour Spectrograms",
    ];
  }

  // since the report is mounted at multiple points in the client (projects, regions, sites), we need to derive the lowest route to use
  private viewReportUrl(): string {
    const routeParameters: RouteParams = {
      projectId: id(this.project),
      regionId: id(this.region),
      siteId: id(this.site),
    };

    if (this.site) {
      return this.site.isPoint
        ? reportMenuItems.view.siteAndRegion.route.format(routeParameters)
        : reportMenuItems.view.site.route.format(routeParameters);
    } else if (this.region) {
      return reportMenuItems.view.region.route.format(routeParameters);
    }

    return reportMenuItems.view.project.route.format(routeParameters);
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

    const audioRecordingFilters: AudioRecordingFilterModel =
      this.model.dateTime.getValue();

    return new EventSummaryReportParameters(
      regionIds,
      siteIds,
      provenanceIds,
      eventIds,
      this.model.provenanceCutOff,
      this.model.charts.value,
      audioRecordingFilters.timeStartedAfter,
      audioRecordingFilters.timeFinishedBefore,
      audioRecordingFilters.dateStartedAfter as any,
      audioRecordingFilters.dateFinishedBefore as any,
      this.model.binSize
    );
  }
}

function getPageInfo(subRoute: keyof typeof reportMenuItems.new): IPageInfo {
  return {
    pageRoute: reportMenuItems.new[subRoute],
    category: reportCategories.new[subRoute],
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
