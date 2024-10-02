import { Component, EventEmitter, Input, Output } from "@angular/core";
import { StandardApi } from "@baw-api/api-common";
import { InnerFilter } from "@baw-api/baw-api.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { VerificationService } from "@baw-api/verification/verification.service";
import { AnnotationSearchParameters, IAnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import {
  contains,
  filterAnd,
  filterModel,
  notIn,
} from "@helpers/filters/filters";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
import { TypeaheadSearchCallback } from "@shared/typeahead-input/typeahead-input.component";
import { DateTime } from "luxon";
import { Observable } from "rxjs";

@Component({
  selector: "baw-annotation-search-form",
  templateUrl: "annotation-search-form.component.html",
  styleUrl: "annotation-search-form.component.scss",
})
export class AnnotationSearchFormComponent {
  public constructor(
    protected verificationApi: VerificationService,
    protected projectsApi: ProjectsService,
    protected regionsApi: ShallowRegionsService,
    protected sitesApi: ShallowSitesService,
    protected tagsApi: TagsService
  ) {}

  @Input({ required: true }) public searchParameters: AnnotationSearchParameters;
  @Output() public searchParametersChange = new EventEmitter<AnnotationSearchParameters>();

  @Input() public project: Project;
  @Input() public region?: Region;
  @Input() public site?: Site;

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

  protected updateModel(
    key: keyof IAnnotationSearchParameters,
    value: any
  ): void {
    this.searchParameters[key] = value;
    this.searchParametersChange.emit(this.searchParameters);
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
