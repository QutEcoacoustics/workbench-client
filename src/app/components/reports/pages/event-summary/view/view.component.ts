import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers, ResolvedModelList } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
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
import { Duration } from "luxon";
import { Tag } from "@models/Tag";
import {
  Location,
  DecimalPipe,
  PercentPipe,
  TitleCasePipe,
} from "@angular/common";
import { NgbModal, NgbTooltip, NgbCollapse } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Observable } from "rxjs";
import { Filters } from "@baw-api/baw-api.service";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DatetimeComponent } from "@shared/datetime-formats/datetime/datetime/datetime.component";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { ChartComponent } from "@shared/chart/chart.component";
import { DurationComponent } from "@shared/datetime-formats/duration/duration.component";
import { UrlDirective } from "@directives/url/url.directive";
import { ConfidencePlotComponent } from "@shared/charts/confidence-plot/confidence-plot.component";
import { CoveragePlotComponent } from "@shared/charts/coverage-plot/coverage-plot.component";
import { SpeciesAccumulationCurveComponent } from "@shared/charts/species-accumulation-curve/species-accumulation-curve.component";
import { DateTimePipe } from "@pipes/date/date.pipe";
import { TimePipe } from "@pipes/time/time.pipe";
import { IsUnresolvedPipe } from "@pipes/is-unresolved/is-unresolved.pipe";
import { SpeciesCompositionGraphComponent } from "@shared/charts/species-composition/species-composition.component";
import { SiteMapComponent } from "../../../../projects/components/site-map/site-map.component";
import {
  Chart,
  EventSummaryReportParameters,
} from "../EventSummaryReportParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const reportKey = "report";

@Component({
  selector: "baw-summary-report",
  templateUrl: "./view.component.html",
  styleUrl: "./view.component.scss",
  imports: [
    NgbTooltip,
    FaIconComponent,
    DatetimeComponent,
    InlineListComponent,
    SiteMapComponent,
    DurationComponent,
    NgbCollapse,
    DecimalPipe,
    PercentPipe,
    TitleCasePipe,
    IsUnresolvedPipe,
    TimePipe,
    DateTimePipe,
    UrlDirective,
    ConfidencePlotComponent,
    CoveragePlotComponent,
    SpeciesAccumulationCurveComponent,
    SpeciesCompositionGraphComponent,
],
})
class ViewEventReportComponent extends PageComponent implements OnInit {
  protected readonly eventSummaryReportApi = inject(EventSummaryReportService);
  protected readonly session = inject(BawSessionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly modalService = inject(NgbModal);

  public parameterDataModel: EventSummaryReportParameters;
  public report: EventSummaryReport;
  public user: User;
  public project: Project;
  public region?: Region;
  public site?: Site;

  protected chartTypes = Chart;

  public filters$: BehaviorSubject<Filters<any>> = new BehaviorSubject({
    paging: { page: 1 },
    sorting: { direction: "asc", orderBy: "tag" },
  });

  @ViewChild("printingModal") public printingModal: ElementRef;
  @ViewChild("compositionChart") public compositionChart: ChartComponent;

  public ngOnInit(): void {
    // we can use "as" here to provide stronger typing because the data property is a standard object type without any typing
    const models: ResolvedModelList = retrieveResolvers(
      this.route.snapshot.data as IPageInfo
    );

    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
    this.report = models[reportKey]?.[0] as EventSummaryReport;
    this.parameterDataModel = models[
      reportKey
    ]?.[1] as EventSummaryReportParameters;
  }

  // we override ctrl + P (most browsers default for window.print shortcut) so we can show a help modal
  @HostListener("document:keydown", ["$event"])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === "p") {
      event.preventDefault();
      this.openPrintModal();
    }
  }

  public getModels = (_filters: any): Observable<any> =>
    new Observable((subscriber) => subscriber.next(this.report.eventGroups));

  protected vegaTagTextFormatter = (tagId: number): string =>
    this.parameterDataModel.tagModels.find(
      (tagModel: Tag) => tagModel.id === tagId
    )?.text;

  protected openPrintModal(): void {
    if (this.shouldUsePrintModal()) {
      this.modalService.open(this.printingModal);
    } else {
      this.printPage();
    }
  }

  // we have to declare a function like this because we can't call window.print() from an angular template
  protected printPage(): void {
    window.print();
  }

  protected shouldUsePrintModal(): boolean {
    return localStorage.getItem("hidePrintModal") === null;
  }

  protected changePrintModalPreference(shouldHide: boolean): void {
    if (shouldHide) {
      localStorage.setItem("hidePrintModal", "true");
    } else {
      localStorage.removeItem("hidePrintModal");
    }
  }

  protected unixEpochToDuration(unixEpoch: number): Duration {
    return Duration.fromMillis(unixEpoch * 1000);
  }

  protected filteredSites(): Site[] {
    // the most common case is when the user has selected sites using the site selector
    if (this.report.sites.length > 0) {
      return this.report.sites;
    }

    // if the user didn't select any sites, the report will default to all sites
    if (this.site) {
      return [this.site];
    } else if (this.region) {
      return this.region.sites;
    }

    return this.project.sites;
  }

  protected shouldShowChart(chart: Chart): boolean {
    // we should display all charts if a subset hasn't been specified
    if (!this.parameterDataModel.charts) {
      return true;
    }

    return this.parameterDataModel.charts.includes(chart);
  }

  protected toggleChart(chart: Chart, show: boolean): void {
    // if the report is generated without any charts parameters, the report will default to rendering all charts
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
