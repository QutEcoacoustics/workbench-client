import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import {
  retrieveResolvers,
  hasResolvedSuccessfully,
  ResolvedModelList,
} from "@baw-api/resolver-common";
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
import { Location } from "@angular/common";
import { Map } from "immutable";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  Chart,
  EventSummaryReportParameters,
} from "../EventSummaryReportParameters";
import coveragePlotSchema from "./coveragePlot.schema.json";
import confidencePlotSchema from "./confidencePlot.schema.json";
import speciesAccumulationCurveSchema from "./speciesAccumulationCurve.schema.json";
import speciesCompositionCurveSchema from "./speciesCompositionCurve.schema.json";

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
    private location: Location,
    private modalService: NgbModal
  ) {
    super();
  }

  public parameterDataModel: EventSummaryReportParameters;
  public report: EventSummaryReport;
  public user: User;
  public project: Project;
  public region?: Region;
  public site?: Site;

  protected coveragePlotSchema = Map(coveragePlotSchema);
  protected confidencePlotSchema = Map(confidencePlotSchema);
  protected speciesAccumulationCurveSchema = Map(
    speciesAccumulationCurveSchema
  );
  protected speciesCompositionCurveSchema = Map(speciesCompositionCurveSchema);
  protected chartTypes = Chart;

  @ViewChild("printingModal") public printingModal: ElementRef;

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
  }

  // we override ctrl + P (most browsers default for window.print shortcut) so we can show a help modal
  @HostListener("document:keydown", ["$event"])
  public handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === "p") {
      event.preventDefault();
      this.openPrintModal();
    }
  }

  protected get currentUser(): User {
    if (this.session.isLoggedIn) {
      return this.session.loggedInUser;
    }

    return User.getUnknownUser(undefined);
  }

  protected vegaTagTextFormatter = (tagId: number): string =>
    this.parameterDataModel.tagModels.find(
      (tagModel: Tag) => tagModel.id === tagId
    ).text;

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

  protected shouldShowChart(chart: Chart): boolean {
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
