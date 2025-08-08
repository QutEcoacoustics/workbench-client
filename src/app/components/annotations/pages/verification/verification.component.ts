import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Inject,
  OnInit,
  signal,
  viewChild,
  ViewChild,
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
import { firstValueFrom, mergeMap } from "rxjs";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { Filters, Paging } from "@baw-api/baw-api.service";
import {
  DecisionMadeEvent,
  VerificationGridComponent,
} from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
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
import { DecisionOptions } from "@ecoacoustics/web-components/@types/models/decisions/decision";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RenderMode } from "@angular/ssr";
import { annotationResolvers } from "@services/models/annotation.resolver";
import { TaggingsService } from "@baw-api/tag/taggings.service";
import {
  TagPromptComponent,
  TypeaheadCallback,
  WhenPredicate,
} from "@ecoacoustics/web-components/@types";
import { Tag } from "@models/Tag";
import { TagsService } from "@baw-api/tag/tags.service";
import { Tagging } from "@models/Tagging";
import { Id } from "@interfaces/apiInterfaces";
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
    private taggingsApi: TaggingsService,
    private tagsApi: TagsService,

    private modals: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    @Inject(ASSOCIATION_INJECTOR) private injector: AssociationInjector,
  ) {
    super();
  }

  @ViewChild("searchFiltersModal")
  private searchFiltersModal: ElementRef<SearchFiltersModalComponent>;

  @ViewChild("verificationGrid")
  private verificationGridElement: ElementRef<VerificationGridComponent>;

  private tagPromptElement =
    viewChild<ElementRef<TagPromptComponent>>("tagPrompt");

  public searchParameters: AnnotationSearchParameters;
  public hasUnsavedChanges = false;
  protected verificationGridFocused = true;
  protected readonly hasCorrectionTask = signal(false);
  private doneInitialScroll = false;

  public project?: Project;
  public region?: Region;
  public site?: Site;

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
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

    this.hasCorrectionTask.set(
      this.searchParameters.taskBehavior === "verify-and-correct-tag",
    );
  }

  public ngAfterViewInit(): void {
    this.updateGridCallback();

    if (this.hasCorrectionTask()) {
      this.tagPromptElement().nativeElement.search = this.tagSearchCallback();
      this.tagPromptElement().nativeElement.when = this.addTagWhenPredicate();
    }
  }

  protected handleGridLoaded(): void {
    if (this.doneInitialScroll) {
      return;
    }

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

  protected tagTextFormatter(tag: Tag): string {
    return tag.text;
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

    this.updateGridCallback();
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
        items.map((item) => this.annotationsService.show(item)),
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

    this.hasCorrectionTask.set(
      this.searchParameters.taskBehavior === "verify-and-correct-tag",
    );
  }

  protected handleDecision(decisionEvent: Event): void {
    if (!this.isDecisionEvent(decisionEvent)) {
      console.error("Received invalid decision event", decisionEvent);
      return;
    }

    this.hasUnsavedChanges = true;

    // TODO: We should be updating the annotation models here after updates.
    // see: https://github.com/QutEcoacoustics/workbench-client/pull/2384#discussion_r2261893642
    const decision = decisionEvent.detail;
    for (const [subject, receipt] of decision) {
      const change = receipt.change;

      if (Object.prototype.hasOwnProperty.call(change, "verification")) {
        this.handleVerificationDecision(subject);
      }

      if (Object.prototype.hasOwnProperty.call(change, "newTag")) {
        this.handleTagCorrectionDecision(subject);
      }
    }
  }

  private handleVerificationDecision(subjectWrapper: SubjectWrapper): void {
    const subject = subjectWrapper.subject as Readonly<AudioEvent>;

    // I have to use "as string" here because the upstream typing is incorrect
    // TODO: We should remove this "as string" and improve the upstream typing
    const mappedDecision =
      confirmedMapping[(subjectWrapper.verification as any).confirmed];

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
    );

    // I use firstValueFrom so that the observable is evaluated
    // but I don't have to subscribe or unsubscribe.
    // Additionally, notice that the function is not awaited so that the
    // render thread can continue to run while the request is being made
    firstValueFrom(apiRequest);
  }

  /**
   * Corrects an incorrectly tagged audio event by applying a new correct
   * tagging and automatically verifying the new tagging as "correct".
   * Making a correction decision is typically conditional upon the initial tag
   * initially having an "incorrect" verification applied.
   */
  private handleTagCorrectionDecision(subjectWrapper: SubjectWrapper): void {
    const audioEvent = subjectWrapper.subject as any;
    const newTagId = subjectWrapper.newTag as any;

    const apiRequest = this.correctTag(audioEvent, newTagId.tag.id);

    firstValueFrom(apiRequest);
  }

  // TODO: This logic should probably be moved to a service
  /**
   * Corrects an incorrect tag on an audio event by verifying the existing tag
   * as "incorrect", creating a new tag that is correct, and submitting a
   * "correct" verification decision.
   */
  private correctTag(audioEvent: AudioEvent, newTagId: Id) {
    const correctTag = new Tagging({
      audioEventId: audioEvent.id,
      tagId: newTagId,
    });

    return this.taggingsApi
      .create(correctTag, audioEvent.audioRecordingId, audioEvent.id)
      .pipe(
        mergeMap(() => {
          const correctVerification = new Verification({
            audioEventId: audioEvent.id,
            confirmed: ConfirmedStatus.Correct,
            tagId: newTagId,
          });

          return this.verificationApi.createOrUpdate(
            correctVerification,
            audioEvent,
          );
        }),
      );
  }

  // TODO: this function can be improved with instanceof checks once we export
  // data model constructors from the web components
  // see: https://github.com/ecoacoustics/web-components/issues/303
  private isDecisionEvent(
    event: Event,
  ): event is CustomEvent<DecisionMadeEvent> {
    return true;
  }

  private scrollToVerificationGrid(): void {
    this.verificationGridElement.nativeElement.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }

  private filterConditions(page: number): Filters<AudioEvent> {
    const paging: Paging = { page };
    const routeFilters = this.searchParameters.toFilter();

    return {
      paging,
      ...routeFilters,
    };
  }

  private updateUrlParameters(): void {
    const queryParams = this.searchParameters.toQueryParams();
    const urlTree = this.router.createUrlTree([], { queryParams });

    // TODO: remove this guard before review. For some reason urlTree is null during testing
    if (urlTree) {
      this.location.replaceState(urlTree.toString());
    }
  }

  private tagSearchCallback(): TypeaheadCallback<any> {
    return (text: string) => {
      const filterBody: Filters<Tag> = {
        filter: {
          text: { contains: text },
        },
      };

      return firstValueFrom(this.tagsApi.filter(filterBody));
    };
  }

  private addTagWhenPredicate(): WhenPredicate {
    return (subject: SubjectWrapper) =>
      subject.tag === null || subject.verification?.["confirmed"] === "false";
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
