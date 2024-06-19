import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StandardApi } from "@baw-api/api-common";
import { InnerFilter } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  regionResolvers,
  ShallowRegionsService,
} from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import {
  ShallowSitesService,
  siteResolvers,
} from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { siteAnnotationsModal } from "@components/sites/sites.modals";
import { verificationMenuItems } from "@components/verification/verification.menu";
import {
  contains,
  filterAnd,
  filterModel,
  notIn,
} from "@helpers/filters/filters";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AbstractModel } from "@models/AbstractModel";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { Tag } from "@models/Tag";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
import { TypeaheadSearchCallback } from "@shared/typeahead-input/typeahead-input.component";
import { List } from "immutable";
import { Observable } from "rxjs";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

interface VerificationSearch {
  tags?: Tag[];
  project?: Project;
  regions?: Region[];
  sites?: Site[];
  dateFilters?: DateTimeFilterModel;
  onlyUnverified?: boolean;
}

@Component({
  selector: "baw-new-verification",
  templateUrl: "new.component.html",
  styleUrl: "new.component.scss",
})
class NewVerificationComponent extends PageComponent implements OnInit {
  public constructor(
    protected sitesApi: ShallowSitesService,
    protected regionsApi: ShallowRegionsService,
    protected tagsApi: TagsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  protected project: Project;
  protected region?: Region;
  protected site?: Site;

  protected model: VerificationSearch = {
    regions: [],
    sites: [],
    tags: [],
    dateFilters: {},
    onlyUnverified: false,
  };

  protected get pageTitle(): string {
    if (this.site) {
      return this.site.isPoint
        ? `Point: ${this.site.name}`
        : `Site: ${this.site.name}`;
    } else if (this.region) {
      return `Site: ${this.region.name}`;
    }

    return `Project: ${this.project.name}`;
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.project = models[projectKey] as Project;

    // generating a report from the region, or site level will immutably scope the report to the model(s)
    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
      this.model.regions = [this.region];
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
      this.model.sites = [this.site];
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

function getPageInfo(
  subRoute: keyof typeof verificationMenuItems.new
): IPageInfo {
  return {
    pageRoute: verificationMenuItems.new[subRoute],
    category: verificationMenuItems.new[subRoute],
    menus: {
      actions: List([verificationMenuItems.view[subRoute], siteAnnotationsModal]),
    },
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

NewVerificationComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { NewVerificationComponent };
