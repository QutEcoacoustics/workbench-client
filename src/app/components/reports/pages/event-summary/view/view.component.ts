import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  ShallowRegionsService,
  regionResolvers,
} from "@baw-api/region/regions.service";
import {
  retrieveResolvers,
  hasResolvedSuccessfully,
  ResolvedModelList,
} from "@baw-api/resolver-common";
import {
  ShallowSitesService,
  siteResolvers,
} from "@baw-api/site/sites.service";
import {
  reportCategories,
  reportMenuItems,
} from "@components/reports/reports.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { EventSummaryReport } from "@models/EventSummaryReport";
import { User } from "@models/User";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { BawSessionService } from "@baw-api/baw-session.service";
import {
  EventSummaryReportService,
  eventSummaryResolvers,
} from "@baw-api/reports/event-report/event-summary-report.service";
import { Observable, first, takeUntil } from "rxjs";
import { TagsService } from "@baw-api/tag/tags.service";
import { Id } from "@interfaces/apiInterfaces";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { Duration } from "luxon";
import { Tag } from "@models/Tag";
import { Location } from "@angular/common";
import { Datasets } from "vega-lite/build/src/spec/toplevel";
import { ExpressionFunction, vega } from "vega-embed";
import {
  Chart,
  EventSummaryReportParameters,
} from "../EventSummaryReportParameters";
import speciesAccumulationCurveSchema from "./speciesAccumulationCurve.schema.json";
import speciesCompositionCurveSchema from "./speciesCompositionCurve.schema.json";
import confidencePlotSchema from "./confidencePlot.schema.json";
import coveragePlotSchema from "./coveragePlot.schema.json";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const reportKey = "report";

@Component({
  selector: "baw-summary-report",
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"],
})
class ViewEventReportComponent extends PageComponent implements OnInit {
  public constructor(
    protected eventSummaryReportApi: EventSummaryReportService,
    private route: ActivatedRoute,
    private router: Router,
    private session: BawSessionService,
    private provenanceApi: AudioEventProvenanceService,
    private tagsApi: TagsService,
    private regionApi: ShallowRegionsService,
    private sitesApi: ShallowSitesService,
    private location: Location
  ) {
    super();
  }

  public parameterDataModel: EventSummaryReportParameters;
  public report: EventSummaryReport;
  public user: User;
  public project: Project;
  public region?: Region;
  public site?: Site;

  public regions: Region[] = [];
  public sites: Site[] = [];
  public tags: Tag[] = [];

  protected speciesAccumulationCurveSchema = speciesAccumulationCurveSchema;
  protected speciesCompositionCurveSchema = speciesCompositionCurveSchema;
  protected confidencePlotSchema = confidencePlotSchema;
  protected coveragePlotSchema = coveragePlotSchema;
  protected chartTypes = Chart;

  public ngOnInit(): void {
    // we can use "as" here to provide stronger typing because the data property is a standard object type without any typing
    const models: ResolvedModelList = retrieveResolvers(
      this.route.snapshot.data as IPageInfo
    );

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
    this.report = models[reportKey][0] as EventSummaryReport;
    this.parameterDataModel = models[
      reportKey
    ][1] as EventSummaryReportParameters;

    this.parameterDataModel.sites?.map((regionId: Id) =>
      this.regionApi
        .show(regionId)
        .pipe(first(), takeUntil(this.unsubscribe))
        .subscribe((regionModel: Region) => this.regions.push(regionModel))
    );

    this.parameterDataModel.points?.map((siteId: Id) =>
      this.sitesApi
        .show(siteId)
        .pipe(first(), takeUntil(this.unsubscribe))
        .subscribe((siteModel: Site) => this.sites.push(siteModel))
    );

    this.parameterDataModel.events?.map((tagId: Id) =>
      this.tagsApi
        .show(tagId)
        .pipe(first(), takeUntil(this.unsubscribe))
        .subscribe((tagModel: Tag) => this.tags.push(tagModel))
    );
  }

  protected get currentUser(): User {
    if (this.session.isLoggedIn) {
      return this.session.loggedInUser;
    }

    return User.getUnknownUser(undefined);
  }

  protected vegaTagText: ExpressionFunction = vega.expressionFunction(
    "customFormatter",
    (tagId: number): string => this.getTag(tagId)?.text
  );

  protected vegaLegendClickCallback = (item) => console.log(item);

  protected vegaTagTextFormatter = (tagId: number): string =>
    this.getTag(tagId)?.text;

  protected get spectrogramUrls(): string[] {
    return [];
  }

  protected printPage(): void {
    window.print();
  }

  protected unixEpochToDuration(unixEpoch: number): Duration {
    return Duration.fromMillis(unixEpoch * 1000);
  }

  protected getProvenance(provenanceId: Id): Observable<AudioEventProvenance> {
    return this.provenanceApi.show(provenanceId).pipe(first());
  }

  protected getTag(tagId: Id): Tag {
    return this.tags.find((tagModel: Tag) => tagModel.id === tagId);
  }

  protected filteredSites(): Site[] {
    // the most common case is when the user has selected sites using the site selector
    if (this.sites.length > 0) {
      return this.sites;
    }

    // if the user didn't select any sites, the report will default to all sites
    if (this.site) {
      return [this.site];
    } else if (this.region) {
      return this.region.sites;
    }

    return this.project.sites;
  }

  protected showChart(chart: Chart): boolean {
    // we should display all charts if a subset hasn't been specified
    if (!this.parameterDataModel.charts) {
      return true;
    }

    return this.parameterDataModel.charts.includes(chart);
  }

  protected toggleChart(chart: Chart, show: boolean): void {
    if (!this.parameterDataModel.charts) {
      this.parameterDataModel.charts = [
        Chart.speciesCompositionCurve,
        Chart.speciesAccumulationCurve,
        Chart.falseColorSpectrograms,
      ];
    }

    if (show) {
      this.parameterDataModel.charts.push(chart);
    } else {
      this.parameterDataModel.charts = this.parameterDataModel.charts.filter(
        (item: Chart) => item !== chart
      );
    }

    if (this.parameterDataModel.charts.length === 0) {
      this.parameterDataModel.charts = [];
    } else if (this.parameterDataModel.charts.length === 3) {
      this.parameterDataModel.charts = null;
    }

    this.updateQueryStringParameters();
  }

  protected coverageDataset(): Datasets {
    return {
      recordingCoverage: this.report.graphs.coverageData.recordingCoverage,
      analysisCoverage: this.report.graphs.coverageData.analysisCoverage,
    };
  }

  /** updates the query string parameters to the data models value */
  private updateQueryStringParameters(): void {
    const queryParams = this.parameterDataModel.toQueryParams();
    const urlTree = this.router.createUrlTree([], { queryParams });
    this.location.replaceState(urlTree.toString());
  }
}

function getPageInfo(subRoute: keyof typeof reportMenuItems.view): IPageInfo {
  return {
    pageRoute: reportMenuItems.view[subRoute],
    category: reportCategories.view[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
      [reportKey]: eventSummaryResolvers.filterShow,
    },
  };
}

ViewEventReportComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { ViewEventReportComponent };
