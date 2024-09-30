import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import {
  regionResolvers,
  ShallowRegionsService,
} from "@baw-api/region/regions.service";
import {
  ShallowSitesService,
  siteResolvers,
} from "@baw-api/site/sites.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import {
  IconName,
  IconPrefix,
  IconProp,
} from "@fortawesome/fontawesome-svg-core";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Location } from "@angular/common";
import { VerificationService } from "@baw-api/verification/verification.service";
import { first, firstValueFrom, Observable, takeUntil } from "rxjs";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { Filters, InnerFilter, Paging } from "@baw-api/baw-api.service";
import { Verification } from "@models/Verification";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/src/components/verification-grid/verification-grid";
import { BawSessionService } from "@baw-api/baw-session.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { StandardApi } from "@baw-api/api-common";
import {
  contains,
  filterAnd,
  filterModel,
  notIn,
} from "@helpers/filters/filters";
import { AbstractModel } from "@models/AbstractModel";
import { TypeaheadSearchCallback } from "@shared/typeahead-input/typeahead-input.component";
import { DateTime } from "luxon";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
import { Id } from "@interfaces/apiInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { AnnotationSearchParameters } from "../annotationSearchParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
// const parameterKey = "parameters";

@Component({
  selector: "baw-verification",
  templateUrl: "verification.component.html",
  styleUrl: "verification.component.scss",
})
class VerificationComponent
  extends PageComponent
  implements OnInit, AfterViewInit
{
  public constructor(
    protected verificationApi: VerificationService,
    protected projectsApi: ProjectsService,
    protected regionsApi: ShallowRegionsService,
    protected sitesApi: ShallowSitesService,
    protected tagsApi: TagsService,

    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private session: BawSessionService,
    private injector: Injector
  ) {
    super();
  }

  public searchParameters: AnnotationSearchParameters;
  public areParametersCollapsed = true;
  public project: Project;
  public region?: Region;
  public site?: Site;
  public previewAudioEvents: Verification[] = [];
  public previewPage = 1;
  public previewSize = 3;

  @ViewChild("verificationGrid")
  private verificationGridElement: ElementRef<VerificationGridComponent>;

  protected get chevronIcon(): IconProp {
    const prefix: IconPrefix = "fas" as const;
    const name: IconName = this.areParametersCollapsed
      ? "chevron-down"
      : "chevron-up";
    return [prefix, name];
  }

  public ngOnInit(): void {
    this.searchParameters ||= new AnnotationSearchParameters({}, this.injector);

    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.project = models[projectKey] as Project;

    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
    }
    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
    }

    // if there are no search parameters, we can assume that the user wants to
    // create a new verification task. We therefore show the parameters by
    // default
    this.areParametersCollapsed =
      Object.keys(this.route.snapshot.queryParams).length > 0;
  }

  public ngAfterViewInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params: Params) => {
        this.updatePagingCallback(params);
      });
  }

  protected toggleParameters(): void {
    this.areParametersCollapsed = !this.areParametersCollapsed;

    if (this.areParametersCollapsed) {
      this.updateGridCallback();
    } else {
      this.updatePreviewResults();
    }
  }

  protected verifyAnnotationsRoute(): StrongRoute {
    if (this.site) {
      return this.site.isPoint
        ? annotationMenuItems.verify.siteAndRegion.route
        : annotationMenuItems.verify.site.route;
    } else if (this.region) {
      return annotationMenuItems.verify.region.route;
    }

    return annotationMenuItems.verify.project.route;
  }

  protected getPageCallback(): any {
    return async (pagedItems: number) => {
      const filters = this.filterConditions(pagedItems);
      const serviceObservable = this.verificationApi.filter(filters);
      let items: Verification[] = await firstValueFrom(serviceObservable);

      // add the auth token to all the audio urls
      items = items.map((item) => {
        item.audioLink = this.buildAudioUrl(item);
        return item;
      });

      return new Object({
        subjects: items,
        context: { page: 1 },
        totalItems: items.length,
      });
    };
  }

  protected buildAudioUrl(audioEvent: Verification): string {
    const basePath = `https://api.staging.ecosounds.org/audio_recordings/${audioEvent.audioRecordingId}/media.flac`;
    const urlParams =
      `?audio_event_id=${audioEvent.id}` +
      `&end_offset=${audioEvent.endTimeSeconds}&start_offset=${audioEvent.startTimeSeconds}` +
      `&user_token=${this.session.authToken}`;
    return basePath + urlParams;
  }

  protected updateModel(
    key: keyof AnnotationSearchParameters,
    value: any
  ): void {
    this.searchParameters[key as any] = value;
    this.updateSearchParameters();

    if (this.areParametersCollapsed) {
      // if the search parameters are collapsed, then the user is performing
      // verifications using the verification component
      // and we should update the verification grid
      this.updateGridCallback();
    } else {
      // if the search parameters form is not collapsed then we want to show a
      // preview of the audio events that the verification grid will display
      this.updatePreviewResults();
    }
  }

  protected pagePreviewNext(): void {
    this.previewPage++;
  }

  protected pagePreviewPrevious(): void {
    if (this.pagedItems <= 0) {
      this.pagedItems = 0;
      return;
    }

    this.previewPage--;
  }

  protected downloadAnnotationsUrl(): string {
    return this.verificationApi.downloadVerificationsTableUrl(
      this.buildFilter()
    );
  }

  private updateGridCallback(): void {
    if (!this.verificationGridElement) {
      console.error("Could not find verification grid element");
      return;
    }

    this.verificationGridElement.nativeElement.getPage =
      this.getPageCallback();
  }

  private updatePreviewResults(): void {
      const filters = this.buildFilter();
      const tagsArray = Array.from(this.searchParameters.tags);

      if (tagsArray.length > 0) {
        this.verificationApi
          .filter(filters)
          .pipe(first(), takeUntil(this.unsubscribe))
          .subscribe((model) => {
            this.previewAudioEvents = model;
          });
      } else {
        this.audioEvents = [];
      }
  }

  private updatePagingCallback(params: Params): void {
    if (!this.verificationGridElement) {
      console.warn("Could not find verification grid element");
      return;
    }

    this.searchParameters = new AnnotationSearchParameters(
      params,
      this.injector
    );

    this.verificationGridElement.nativeElement.getPage = this.getPageCallback();
  }

  private buildFilter(): Filters<Verification> {
    const filter: Filters<Verification> = this.searchParameters.toFilter();
    const paging: Paging = {
      page: this.previewPage,
      items: this.previewSize,
    };

    filter.paging = paging;
    return filter;
  }

  private filterConditions(_pagedItems: number): Filters<Verification> {
    return this.searchParameters.toFilter();
  }

  private updateSearchParameters(): void {
    const queryParams = this.searchParameters.toQueryParams();
    const urlTree = this.router.createUrlTree([], { queryParams });
    this.location.replaceState(urlTree.toString());
  }

  protected createSearchCallback<T extends AbstractModel>(
    api: StandardApi<T>,
    key: string = "name",
    includeDefaultFilters: boolean = true
  ): TypeaheadSearchCallback {
    return (text: string, activeItems: T[]): Observable<T[]> =>
      api.filter({
        filter: filterAnd(
          contains<T, keyof T>(
            key as keyof T,
            text as any,
            includeDefaultFilters && this.defaultFilter()
          ),
          notIn<T>(key as keyof AbstractModel, activeItems)
        ),
      });
  }

  // because the DateTimeFilterModel is coming from a shared component, we need to serialize for use in the data model
  protected updateDateTime(dateTimeModel: DateTimeFilterModel): void {
    if (dateTimeModel.dateStartedAfter || dateTimeModel.dateFinishedBefore) {
      this.searchParameters.date = [
        dateTimeModel.dateStartedAfter
          ? DateTime.fromObject(dateTimeModel.dateStartedAfter)
          : null,
        dateTimeModel.dateFinishedBefore
          ? DateTime.fromObject(dateTimeModel.dateFinishedBefore)
          : null,
      ];
    }

    if (dateTimeModel.timeStartedAfter || dateTimeModel.timeFinishedBefore) {
      this.searchParameters.time = [
        dateTimeModel.timeStartedAfter,
        dateTimeModel.timeFinishedBefore,
      ];

      // because the daylight savings filter is a modifier on the time filter we do not need to update it unless the time filter has a value
      // this.searchParameters.daylightSavings = !dateTimeModel.ignoreDaylightSavings;
    }
  }

  protected getIdsFromAbstractModelArray(items: object[]): Id[] {
    if (items.length === 0) {
      return null;
    }

    const idsArray: Id[] = items.map((item: AbstractModel): Id => item.id);
    return idsArray;
  }

  // we need a default filter to scope to projects, regions, sites
  private defaultFilter(): InnerFilter<Project | Region | Site> {
    // we don't need to filter for every route, we only need to filter for the lowest level
    // this is because all sites have a region, all regions have a project, etc..
    // so it can be logically inferred
    if (this.site) {
      return filterModel("sites", this.site);
    } else if (this.region) {
      return filterModel("regions", this.region);
    } else {
      return filterModel("projects", this.project);
    }
  }
}

function getPageInfo(
  subRoute: keyof typeof annotationMenuItems.verify
): IPageInfo {
  return {
    pageRoute: annotationMenuItems.verify[subRoute],
    category: annotationMenuItems.verify[subRoute],
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

VerificationComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { VerificationComponent };
