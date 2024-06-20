import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { siteAnnotationsModal } from "@components/sites/sites.modals";
import { verificationMenuItems } from "@components/verification/verification.menu";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { CollectionIds, Id } from "@interfaces/apiInterfaces";
import { DateTimeFilterModel } from "@shared/date-time-filter/date-time-filter.component";
import { Verification } from "@models/Verification";
import { Filters } from "@baw-api/baw-api.service";
import { first, takeUntil } from "rxjs";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { VerificationParameters } from "../verificationParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-new-verification",
  templateUrl: "new.component.html",
  styleUrl: "new.component.scss",
})
class NewVerificationComponent extends PageComponent implements OnInit {
  public constructor(
    private route: ActivatedRoute,
    private api: ShallowAudioEventsService
  ) {
    super();
  }

  protected model = new VerificationParameters();
  protected audioEvents: Verification[] = [];
  protected project: Project;
  protected region?: Region;
  protected site?: Site;

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

  public get dateFilters(): DateTimeFilterModel {
    return {};
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.project = models[projectKey] as Project;

    // generating a report from the region, or site level will immutably scope the report to the model(s)
    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
      this.model.regions = new Set<Id>([this.region.id]);
    }

    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
      this.model.sites = new Set<Id>([this.region.id]);
    }
  }

  protected buildAudioUrl(audioEvent: Verification): string {
    const basePath = `https://api.staging.ecosounds.org/audio_recordings/${audioEvent.audioRecordingId}/original`;
    const urlParams = `?end_offset=${audioEvent.endTimeSeconds}&start_offset=${audioEvent.startTimeSeconds}`;
    return basePath + urlParams;
  }

  protected updateModel(newModel: VerificationParameters): void {
    if (!newModel.tags || !Array.from(newModel.tags).length) {
      return;
    }

    this.model = newModel;

    const filters = this.buildFilter(
      this.model.projects?.[0],
      this.model.regions,
      this.model.sites,
      this.model.tags,
      this.dateFilters
    );

    this.api
      .filter(filters)
      .pipe(first(), takeUntil(this.unsubscribe))
      .subscribe((audioEvents) => {
        this.audioEvents = audioEvents;
      });
  }

  private buildFilter(
    _project: Project,
    _regions: CollectionIds,
    _sites: CollectionIds,
    tags: CollectionIds,
    _dateFilters: DateTimeFilterModel
  ): Filters<Verification> {
    return {
      filter: {
        isReference: {
          eq: true,
        },
        "tags.id": {
          in: tags ?? [],
        },
      },
    } as Filters<Verification>;

    // TODO: this is disabled because the API is not yet implemented
    // return {
    //   filter: {
    //     isReference: {
    //       eq: true,
    //     },
    //     "tags.id": {
    //       in: tags,
    //     },
    //     "projects.id": {
    //       eq: project.id,
    //     },
    //     "regions.id": {
    //       in: regions,
    //     },
    //     "sites.id": {
    //       in: sites,
    //     },
    //   },
    // } as Filters<Verification>;
  }
}

function getPageInfo(
  subRoute: keyof typeof verificationMenuItems.new
): IPageInfo {
  return {
    pageRoute: verificationMenuItems.new[subRoute],
    category: verificationMenuItems.new[subRoute],
    menus: {
      actions: List([
        verificationMenuItems.view[subRoute],
        siteAnnotationsModal,
      ]),
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
