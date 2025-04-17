import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { retrieveResolvers } from "@baw-api/resolvers/resolver-common";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { Filters, InnerFilter, Paging } from "@baw-api/baw-api.service";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import { StrongRoute } from "@interfaces/strongRoute";
import { ProgressWarningComponent } from "@components/annotations/components/modals/progress-warning/progress-warning.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SearchFiltersModalComponent } from "@components/annotations/components/modals/search-filters/search-filters.component";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import { PageFetcherContext } from "@ecoacoustics/web-components/@types/services/gridPageFetcher";
import {
  annotationResolvers,
  AnnotationService,
} from "@services/models/annotation.service";
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
  templateUrl: "verification.component.html",
  styleUrl: "verification.component.scss",
  standalone: false
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
    @Inject(ASSOCIATION_INJECTOR) private injector: AssociationInjector
  ) {
    super();
  }

  @ViewChild("progressWarningModal")
  private lostProgressWarningModal: ElementRef<ProgressWarningComponent>;

  @ViewChild("searchFiltersModal")
  private searchFiltersModal: ElementRef<SearchFiltersModalComponent>;

  @ViewChild("verificationGrid")
  private verificationGridElement: ElementRef<VerificationGridComponent>;

  public searchParameters: AnnotationSearchParameters;
  public hasUnsavedChanges = false;
  protected verificationGridFocused = true;
  private doneInitialScroll = false;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data);
    this.searchParameters ??= models[
      annotationsKey
    ] as AnnotationSearchParameters;
    this.searchParameters.injector = this.injector;

    this.searchParameters.routeProjectModel ??= models[projectKey] as Project;
    if (models[regionKey]) {
      this.searchParameters.routeRegionModel ??= models[regionKey] as Region;
    }
    if (models[siteKey]) {
      this.searchParameters.routeSiteModel ??= models[siteKey] as Site;
    }
  }

  public ngAfterViewInit(): void {
    this.updateGridCallback();
  }

  protected handleGridLoaded(): void {
    if (this.doneInitialScroll) {
      return;
    }

    // because the verification grid keybindings are scoped at the component
    // level, we automatically focus the verification grid component so that
    // users don't have to manually focus the verification grid to start using
    // shortcuts
    //
    // without this automatic focusing, the user would have to click on the
    // verification grid (e.g. to make a sub-selection) before being able to
    // use the shortcut keys
    this.focusVerificationGrid();

    const timeoutDurationMilliseconds = 1_000 as const;

    // we wait a second after the verification grid has loaded to give the user
    // some time to see the grid in the context of the website before we scroll
    // them down to the grid
    setTimeout(() => {
      this.scrollToVerificationGrid();
    }, timeoutDurationMilliseconds);

    // we set the done initial scroll value before the timeout so that we don't
    // send two scroll events if the user makes a decision before the timeout
    this.doneInitialScroll = true;
  }

  protected handleDecision(decisionEvent: Event): void {
    if (!this.isDecisionEvent(decisionEvent)) {
      console.error("Received invalid decision event", decisionEvent);
      return;
    }

    this.hasUnsavedChanges = true;

    const subjectWrappers = decisionEvent.detail;
    for (const subjectWrapper of subjectWrappers) {
      const subject = subjectWrapper.subject as Readonly<AudioEvent>;

      // I have to use "as string" here because the upstream typing is incorrect
      // TODO: We should remove this "as string" and improve the upstream typing
      const mappedDecision =
        confirmedMapping[subjectWrapper.verification.confirmed as string];

      const tagId = subjectWrapper.tag.id;

      const verificationData = {
        audioEventId: subject.id,
        confirmed: mappedDecision,
        tagId,
      } as const satisfies IVerification;

      const verification = new Verification(verificationData, this.injector);

      // I have to use "as any" here to remove the readonly typing
      const apiRequest = this.verificationApi.createOrUpdate(
        verification,
        subject as AudioEvent,
        this.session.currentUser
      );

      // I use firstValueFrom so that the observable is evaluated
      // but I don't have to subscribe or unsubscribe.
      // Additionally, notice that the function is not awaited so that the
      // render thread can continue to run while the request is being made
      firstValueFrom(apiRequest);
    }
  }

  protected focusVerificationGrid(): void {
    this.verificationGridElement.nativeElement.focus();
  }

  protected openSearchFiltersModal(): void {
    this.modals.open(this.searchFiltersModal, { size: "xl" });
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

    // TODO: this is a hacky solution to get the verification grid to update
    this.verificationGridElement.nativeElement.getPage = this.getPageCallback();
    this.verificationGridElement.nativeElement.subjects = [];
    this.updateUrlParameters();
    this.hasUnsavedChanges = false;
  }

  // TODO: this function can be improved with instanceof checks once we export
  // data model constructors from the web components
  // see: https://github.com/ecoacoustics/web-components/issues/303
  private isDecisionEvent(
    event: Event
  ): event is CustomEvent<SubjectWrapper[]> {
    return (
      event instanceof CustomEvent &&
      event.detail instanceof Array &&
      event.detail.length > 0 &&
      "subject" in event.detail[0]
    );
  }

  private scrollToVerificationGrid(): void {
    this.verificationGridElement.nativeElement.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }

  private filterConditions(page: number): Filters<AudioEvent> {
    const paging: Paging = { page };
    const filter: InnerFilter<AudioEvent> =
      this.searchParameters.toFilter().filter;

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
