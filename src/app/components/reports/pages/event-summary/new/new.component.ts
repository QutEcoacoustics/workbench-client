import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PageComponent } from "@helpers/page/pageComponent";
import { Site } from "@models/Site";
import { BehaviorSubject, Observable, of, takeUntil } from "rxjs";
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
import { AudioRecording } from "@models/AudioRecording";
import {
  EventSummaryReportParameters,
  GraphType,
} from "../EventSummaryReportParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

interface IEventReportConditions {
  dateTime: AudioRecordingFilterModel;
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
    private route: ActivatedRoute,
    private router: Router,
    private sitesApi: SitesService,
    private regionsApi: RegionsService,
    private provenanceApi: AudioEventProvenanceService,
    private tagsApi: TagsService
  ) {
    super();
  }

  public project: Project;
  public region: Region;
  public site: Site;

  // TODO: remove this
  public dateTimeConditions$: BehaviorSubject<AudioRecordingFilterModel> =
    new BehaviorSubject({});
  public filters$: BehaviorSubject<Filters<AudioRecording>> = new BehaviorSubject({});

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
    this.dateTimeConditions$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((conditions) => {
        this.model.dateTime = conditions;
      });

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

  public get chartsNames(): GraphType[] {
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

    this.router.navigateByUrl(this.viewUrl() + `?${queryStringParameters}`);
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

  public eventsOfInterestFormatter = (tag: Tag): string => tag.text;
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

  // since the report is mounted at multiple points in the client (projects, regions, sites), we need to derive the lowest route to use
  public viewUrl(): string {
    const routeParameters: RouteParams = {
      projectId: id(this.project),
      regionId: id(this.region),
      siteId: id(this.site),
    };

    if (this.site) {
      if (this.site.isPoint) {
        return reportMenuItems.view.siteAndRegion.route.format(routeParameters);
      } else {
        return reportMenuItems.view.site.route.format(routeParameters);
      }
    } else if (this.region) {
      return reportMenuItems.view.region.route.format(routeParameters);
    } else if (this.project) {
      return reportMenuItems.view.project.route.format(routeParameters);
    }

    // the function should never reach this point as reports will always have at least a project
    // TODO: Although the program should never reach this position, we should show an "unrecoverable error" to the user
    return null;
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

    const audioRecordingFilters: AudioRecordingFilterModel = this.model.dateTime;

    return new EventSummaryReportParameters(
      regionIds,
      siteIds,
      provenanceIds,
      eventIds,
      this.model.recognizerCutOff,
      this.model.charts.value,
      audioRecordingFilters.timeStartedAfter,
      audioRecordingFilters.timeFinishedBefore,
      audioRecordingFilters.dateStartedAfter as any,
      audioRecordingFilters.dateFinishedBefore as any
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
