import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { StandardApi } from "@baw-api/api-common";
import { InnerFilter } from "@baw-api/baw-api.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import {
  filterAnd,
  notIn,
  filterModel,
  contains,
} from "@helpers/filters/filters";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
import { TypeaheadSearchCallback } from "@shared/typeahead-input/typeahead-input.component";
import { Observable } from "rxjs";

export interface VerificationSearch {
  tags?: Tag[];
  project?: Project;
  regions?: Region[];
  sites?: Site[];
  dateFilters?: DateTimeFilterModel;
  onlyUnverified?: boolean;
}

@Component({
  selector: "baw-annotation-search-form",
  templateUrl: "annotation-search-form.component.html",
})
export class AnnotationSearchFormComponent implements OnChanges {
  public constructor(
    protected sitesApi: ShallowSitesService,
    protected regionsApi: ShallowRegionsService,
    protected tagsApi: TagsService
  ) {}

  @Input({ required: true })
  public project?: Project;

  // while forms have to be scoped to a project, it is possible to have the form
  // not scoped to a region or site
  // in this case, region, site, or both will be undefined
  @Input()
  public region?: Region;

  @Input()
  public site?: Site;

  @Input()
  public form?: VerificationSearch;
  @Output()
  public formChange = new EventEmitter<VerificationSearch>();

  // because the model is a two way data-binding, we need to emit changes
  // whenever the model changes
  // if we do this inside the ngOnChanges, the data binding updates will be a
  // part of the same detection cycle, which keeps overhead to a minimum
  public ngOnChanges(changes: SimpleChanges): void {
    if ("model" in changes) {
      this.formChange.emit(this.form);
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

  protected convertToTag(model: object[]): Tag[] {
    return model as Tag[];
  }

  protected convertToRegion(model: object[]): Region[] {
    return model as Region[];
  }

  protected convertToSite(model: object[]): Site[] {
    return model as Site[];
  }
}
