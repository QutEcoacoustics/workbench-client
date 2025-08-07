import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
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
import { Filters, Paging } from "@baw-api/baw-api.service";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import { StrongRoute } from "@interfaces/strongRoute";
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { SearchFiltersModalComponent } from "@components/annotations/components/modals/search-filters/search-filters.component";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { PageFetcherContext } from "@ecoacoustics/web-components/@types/services/gridPageFetcher";
import { AnnotationService } from "@services/models/annotation.service";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ShallowVerificationService } from "@baw-api/verification/verification.service";
import {
  ConfirmedStatus,
  IVerification,
  Verification,
} from "@models/Verification";
import { SubjectWrapper } from "@ecoacoustics/web-components/@types/models/subject";
import { BawSessionService } from "@baw-api/baw-session.service";
import { DecisionOptions } from "@ecoacoustics/web-components/@types/models/decisions/decision";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RenderMode } from "@angular/ssr";
import { annotationResolvers } from "@services/models/annotation.resolver";
import { AnnotationSearchParameters } from "../annotationSearchParameters";

interface PagingContext extends PageFetcherContext {
  page: number;
}

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
const annotationsKey = "annotations";

const confirmedMapping = {
  true: ConfirmedStatus.Correct,
  false: ConfirmedStatus.Incorrect,
  unsure: ConfirmedStatus.Unsure,
  skip: ConfirmedStatus.Skip,
} as const satisfies Record<DecisionOptions, ConfirmedStatus>;

@Component({
  selector: "baw-verification",
  templateUrl: "./verification.component.html",
  styleUrl: "./verification.component.scss",
  imports: [FaIconComponent, NgbTooltip, SearchFiltersModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class VerificationComponent
  extends PageComponent
  implements OnInit, AfterViewInit, UnsavedInputCheckingComponent
{
  public constructor(
    private audioEventApi: ShallowAudioEventsService,
    private verificationApi: ShallowVerificationService,
    private annotationsService: AnnotationService,

    private session: BawSessionService,
    private modals: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    @Inject(ASSOCIATION_INJECTOR) private injector: AssociationInjector,
  ) {
    super();
  }

  private searchFiltersModal =
    viewChild<ElementRef<SearchFiltersModalComponent>>("searchFiltersModal");
  private verificationGridElement =
    viewChild<ElementRef<VerificationGridComponent>>("verificationGrid");

  public searchParameters = signal<AnnotationSearchParameters | null>(null);
  public hasUnsavedChanges = signal(false);
  protected verificationGridFocused = signal(true);
  private doneInitialScroll = signal(false);

  public project = signal<Project | null>(null);
  public region = signal<Region | null>(null);
  public site = signal<Site | null>(null);

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.searchParameters.update((current) => {
      const newModel = current ?? (models[annotationsKey] as AnnotationSearchParameters);

      newModel.injector = this.injector;

      current.routeProjectModel ??= models[projectKey] as Project;

      if (models[regionKey]) {
        current.routeRegionModel ??= models[regionKey] as Region;
      }

      if (models[siteKey]) {
        current.routeSiteModel ??= models[siteKey] as Site;
      }

      return newModel;
    });
  }

  public ngAfterViewInit(): void {
    this.updateGridCallback();
  }

  protected handleGridLoaded(): void {
    if (this.doneInitialScroll()) {
      return;
    }

    const timeoutDurationMilliseconds = 1_000;

    // we wait a second after the verification grid has loaded to give the user
    // some time to see the grid in the context of the website before we scroll
    // them down to the grid
    setTimeout(() => {
      this.scrollToVerificationGrid();
    }, timeoutDurationMilliseconds);

    // we set the done initial scroll value before the timeout so that we don't
    // send two scroll events if the user makes a decision before the timeout
    this.doneInitialScroll.set(true);
  }

  protected handleDecision(decisionEvent: Event): void {
    if (!this.isDecisionEvent(decisionEvent)) {
      console.error("Received invalid decision event", decisionEvent);
      return;
    }

    this.hasUnsavedChanges.set(true);

    const subjectWrappers = decisionEvent.detail;
    for (const subjectWrapper of subjectWrappers) {
      const subject = subjectWrapper.subject as Readonly<AudioEvent>;

      // I have to use "as string" here because the upstream typing is incorrect
      // TODO: We should remove this "as string" and improve the upstream typing
      const mappedDecision =
        confirmedMapping[subjectWrapper.verification.confirmed as string];

      const tagId = subjectWrapper.tag.id;

      const verificationData: IVerification = {
        audioEventId: subject.id,
        confirmed: mappedDecision,
        tagId,
      };

      const verification = new Verification(verificationData, this.injector);

      // I have to use "as any" here to remove the readonly typing
      const apiRequest = this.verificationApi.createOrUpdate(
        verification,
        subject as AudioEvent,
        this.session.currentUser,
      );

      // I use firstValueFrom so that the observable is evaluated
      // but I don't have to subscribe or unsubscribe.
      // Additionally, notice that the function is not awaited so that the
      // render thread can continue to run while the request is being made
      firstValueFrom(apiRequest);
    }
  }

  protected openSearchFiltersModal(): void {
    this.modals.open(this.searchFiltersModal(), { size: "xl" });
  }

  protected requestModelUpdate(newModel: AnnotationSearchParameters) {
    if (!this.hasUnsavedChanges()) {
      this.searchParameters.set(newModel);
      this.updateGridCallback();
      return;
    }

    this.updateGridCallback();
  }

  protected verifyAnnotationsRoute(): StrongRoute {
    if (this.site()) {
      return this.site().isPoint
        ? annotationMenuItems.verify.siteAndRegion.route
        : annotationMenuItems.verify.site.route;
    } else if (this.region()) {
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
        items.map((item) =>
          this.annotationsService.show(
            item,
            this.searchParameters().tagPriority,
          ),
        ),
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

    // TODO: this is a hacky solution to get the verification grid to update
    this.verificationGridElement().nativeElement.getPage =
      this.getPageCallback();
    this.verificationGridElement().nativeElement.subjects = [];
    this.updateUrlParameters();
    this.hasUnsavedChanges.set(false);
  }

  // TODO: this function can be improved with instanceof checks once we export
  // data model constructors from the web components
  // see: https://github.com/ecoacoustics/web-components/issues/303
  private isDecisionEvent(
    event: Event,
  ): event is CustomEvent<SubjectWrapper[]> {
    return (
      event instanceof CustomEvent &&
      event.detail instanceof Array &&
      event.detail.length > 0 &&
      "subject" in event.detail[0]
    );
  }

  private scrollToVerificationGrid(): void {
    this.verificationGridElement().nativeElement.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }

  private filterConditions(page: number): Filters<AudioEvent> {
    const paging: Paging = { page };
    const routeFilters = this.searchParameters().toFilter();

    return {
      paging,
      ...routeFilters,
    };
  }

  private updateUrlParameters(): void {
    const queryParams = this.searchParameters().toQueryParams();
    const urlTree = this.router.createUrlTree([], { queryParams });
    this.location.replaceState(urlTree.toString());
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
    renderMode: RenderMode.Client,
  };
}

VerificationComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { VerificationComponent };
