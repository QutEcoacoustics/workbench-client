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
import { retrieveResolvers } from "@baw-api/resolver-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { Filters, InnerFilter, Paging } from "@baw-api/baw-api.service";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import { TagsService } from "@baw-api/tag/tags.service";
import { StrongRoute } from "@interfaces/strongRoute";
import { ResetProgressWarningComponent } from "@components/annotations/components/reset-progress-warning/reset-progress-warning.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SearchFiltersModalComponent } from "@components/annotations/components/search-filters-modal/search-filters-modal.component";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { PageFetcherContext } from "@ecoacoustics/web-components/@types/services/gridPageFetcher";
import { annotationResolvers, AnnotationService } from "@services/models/annotation.service";
import { filterAnd } from "@helpers/filters/filters";
import { AnnotationSearchParameters } from "../annotationSearchParameters";

// TODO: using extends here makes the interface loosely typed
// we should some sort of "satisfies" operation instead
interface PagingContext extends PageFetcherContext {
  page: number;
}

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const annotationsKey = "annotations";

@Component({
  selector: "baw-verification",
  templateUrl: "verification.component.html",
  styleUrl: "verification.component.scss",
})
class VerificationComponent
  extends PageComponent
  implements OnInit, AfterViewInit, UnsavedInputCheckingComponent
{
  public constructor(
    protected audioEventApi: ShallowAudioEventsService,
    protected projectsApi: ProjectsService,
    protected regionsApi: ShallowRegionsService,
    protected sitesApi: ShallowSitesService,
    protected tagsApi: TagsService,
    protected annotationsService: AnnotationService,

    protected modals: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private injector: Injector
  ) {
    super();
  }

  @ViewChild("progressWarningModal")
  private lostProgressWarningModal: ElementRef<ResetProgressWarningComponent>;

  @ViewChild("searchFiltersModal")
  private searchFiltersModal: ElementRef<SearchFiltersModalComponent>;

  @ViewChild("verificationGrid")
  private verificationGridElement: ElementRef<VerificationGridComponent>;

  public searchParameters: AnnotationSearchParameters;
  public project: Project;
  public region?: Region;
  public site?: Site;
  public hasUnsavedChanges = false;
  private doneInitialScroll = false;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.searchParameters = models[annotationsKey] as AnnotationSearchParameters;
    this.searchParameters.injector = this.injector;

    this.project = models[projectKey] as Project;
    if (models[regionKey]) {
      this.region = models[regionKey] as Region;
    }
    if (models[siteKey]) {
      this.site = models[siteKey] as Site;
    }
  }

  public ngAfterViewInit(): void {
    this.updateGridCallback();
  }

  protected openSearchFiltersModal(): void {
    this.modals.open(this.searchFiltersModal, { size: "xl" });
  }

  protected handleGridLoaded(): void {
    if (this.doneInitialScroll) {
      return;
    }

    const timeoutDuration = 1000;

    // we wait a second after the verification grid has loaded to give the user
    // some time to see the grid in the context of the website before we scroll
    // them down to the grid
    setTimeout(() => {
      this.scrollToVerificationGrid();
    }, timeoutDuration);

    // we set the done initial scroll value before the timeout so that we don't
    // send two scroll events if the user makes a decision before the timeout
    this.doneInitialScroll = true;
  }

  protected handleDecision(): void {
    this.hasUnsavedChanges = true;
  }

  protected requestModelUpdate(newModel: AnnotationSearchParameters) {
    if (!this.hasUnsavedChanges) {
      this.searchParameters = newModel;
      this.updateGridCallback();
      return;
    }

    // if the user has unsaved changes, we want to warn them that their progress
    // will be lost if they update the search parameters
    const confirmationModal = this.modals.open(this.lostProgressWarningModal);
    confirmationModal.result.then((success: boolean) => {
      if (success) {
        this.searchParameters = newModel;
        this.updateGridCallback();
      } else {
        this.openSearchFiltersModal();
      }
    });
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
    return async ({ page }: PagingContext) => {
      const nextPage = (page ?? 0) + 1;
      const filters = this.filterConditions(nextPage);
      const serviceObservable = this.audioEventApi.filter(filters);

      const items: AudioEvent[] = await firstValueFrom(serviceObservable);
      const annotations = await Promise.all(
        items.map((item) => this.annotationsService.show(item))
      );

      return new Object({
        subjects: annotations,
        context: { page: nextPage },
        totalItems: items.length,
      });
    };
  }

  protected updateGridCallback(): void {
    if (!this.verificationGridElement) {
      console.error("Could not find verification grid element");
      return;
    }

    this.verificationGridElement.nativeElement.getPage = this.getPageCallback();
    this.updateUrlParameters();
    this.hasUnsavedChanges = false;
  }

  private scrollToVerificationGrid(): void {
    this.verificationGridElement.nativeElement.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }

  private filterConditions(page: number): Filters<AudioEvent> {
    const filter: InnerFilter<AudioEvent> = this.searchFilters().filter;
    const paging: Paging = { page };

    return { filter, paging };
  }

  private updateUrlParameters(): void {
    const queryParams = this.searchParameters.toQueryParams();
    const urlTree = this.router.createUrlTree([], { queryParams });

    // TODO: remove this guard before review. For some reason urlTree is null during testing
    if (urlTree) {
      this.location.replaceState(urlTree.toString());
    }
  }

  private searchFilters(): Filters<AudioEvent> {
    const initialFilter = this.searchParameters.toFilter();
    if (this.site) {
      initialFilter.filter = filterAnd(initialFilter.filter, {
        "audioRecordings.siteId": { in: [this.site.id] },
      } as any);
      return initialFilter;
    }

    if (this.region) {
      initialFilter.filter = filterAnd(initialFilter.filter, {
        "audioRecordings.siteId": { in: Array.from(this.region.siteIds) },
      } as any);
      return initialFilter;
    }

    initialFilter.filter = filterAnd(initialFilter.filter, {
      "audioRecordings.siteId": { in: Array.from(this.project.siteIds) },
    } as any);

    return initialFilter;
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
      [annotationsKey]: annotationResolvers.showOptional,
    },
    fullscreen: true,
  };
}

VerificationComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { VerificationComponent };
