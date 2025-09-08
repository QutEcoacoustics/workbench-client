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
  viewChildren,
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
import { firstValueFrom, map } from "rxjs";
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
import { AnnotationService } from "@services/models/annotations/annotation.service";
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
import { annotationResolvers } from "@services/models/annotations/annotation.resolver";
import {
  TagPromptComponent,
  TypeaheadCallback,
  WhenPredicate,
} from "@ecoacoustics/web-components/@types";
import { Tag } from "@models/Tag";
import { TagsService } from "@baw-api/tag/tags.service";
import { Tagging } from "@models/Tagging";
import { decisionNotRequired } from "@ecoacoustics/web-components/dist/models/decisions/decisionNotRequired";
import { TaggingCorrectionsService } from "@services/models/tagging-corrections/tagging-corrections.service";
import { TaggingCorrection } from "@models/data/TaggingCorrection";
import { ScrollService } from "@services/scroll/scroll.service";
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
    private tagsApi: TagsService,
    private tagCorrections: TaggingCorrectionsService,

    private scrollService: ScrollService,
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
  private tagPromptElement =
    viewChild<ElementRef<TagPromptComponent>>("tagPrompt");
  private verificationDecisionElements =
    viewChildren<ElementRef<TagPromptComponent>>("verificationDecision");

  public searchParameters = signal<AnnotationSearchParameters | null>(null);
  public hasUnsavedChanges = signal(false);
  protected verificationGridFocused = signal(true);
  protected hasCorrectionTask = signal(false);
  private doneInitialScroll = signal(false);

  public project = signal<Project | null>(null);
  public region = signal<Region | null>(null);
  public site = signal<Site | null>(null);

  // TODO: Remove this once the corrections endpoint is finished
  /**
   * A mapping of audio events and the currently applied tag correction model
   * in the form of a fully-fledged Tagging model.
   *
   * This is useful when trying to update the correction on an audio event and
   * you need to delete a tagging that was previously applied.
   *
   * By using a client-side map, we can cache the tagging client side and
   * prevent making another request to the api.
   */
  private sessionTagCorrections = new Map<AudioEvent["id"], Tagging>();

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    this.searchParameters.update((current) => {
      const newModel = current ?? (models[annotationsKey] as AnnotationSearchParameters);
      newModel.injector = this.injector;

      newModel.routeProjectModel ??= models[projectKey] as Project;

      if (models[regionKey]) {
        newModel.routeRegionModel ??= models[regionKey] as Region;
      }

      if (models[siteKey]) {
        newModel.routeSiteModel ??= models[siteKey] as Site;
      }

      return newModel;
    });

    this.hasCorrectionTask.set(
      this.searchParameters().taskBehavior === "verify-and-correct-tag",
    );
  }

  public ngAfterViewInit(): void {
    this.updateGridCallback();

    if (this.hasCorrectionTask()) {
      this.tagPromptElement().nativeElement.search = this.tagSearchCallback();
      this.tagPromptElement().nativeElement.when = this.addTagWhenPredicate();
    }

    const verificationDecisions = this.verificationDecisionElements();
    for (const decisionElement of verificationDecisions) {
      decisionElement.nativeElement.when = this.tagVerificationPredicate();
    }
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

  protected tagTextFormatter(tag: Tag): string {
    return tag.text;
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

    this.hasCorrectionTask.set(
      this.searchParameters().taskBehavior === "verify-and-correct-tag",
    );
  }

  protected handleDecision(decisionEvent: Event): void {
    if (!this.isDecisionEvent(decisionEvent)) {
      console.error("Received invalid decision event", decisionEvent);
      return;
    }

    this.hasUnsavedChanges.set(true);

    // TODO: We should be updating the annotation models here after updates.
    // see: https://github.com/QutEcoacoustics/workbench-client/pull/2384#discussion_r2261893642
    const decision = decisionEvent.detail;
    for (const [subject, receipt] of decision) {
      const change = receipt.change;

      // Emitting the old model was a hack added to the web components to get a
      // feature shipped quickly.
      // TODO: Once the web components emit a more descriptive decision-made
      // event, we should replace this hack.
      // see: https://github.com/ecoacoustics/web-components/issues/448
      const oldSubject = receipt.oldSubject as any;

      const verificationChange = change.verification;
      if (verificationChange === null) {
        this.deleteVerificationDecision(subject);
      } else if (verificationChange) {
        this.handleVerificationDecision(subject);
      }

      const newTagDecision = change.newTag;
      const oldSubjectTagCorrection: Tag | undefined = oldSubject.newTag?.tag;

      if (newTagDecision === null || newTagDecision === decisionNotRequired || newTagDecision?.["confirmed"] === "skip") {
        this.deleteTagCorrectionDecision(subject, oldSubjectTagCorrection);
      } else if (newTagDecision) {
        // If there was a newTag (tag correction) applied in the previous
        // subject model, we need to delete it before applying the new
        // decision.
        //
        // TODO: Comparing by tag text here is probably not the most robust
        // solution, but I have done it to push out a feature quickly.
        // I compare the tag text so that if the currently applied tag is
        // selected again, we don't throw a conflict error from trying to
        // correct the currently applied tag.
        //
        // We know that the newTagDecision is a Tag model and not a
        // decisionNotRequired because the if condition would have caught the
        // decision not required condition.
        // Therefore, while bad, this "as any" is theoretically fine
        // (although not type checked).
        if (
          (newTagDecision as any).tag?.text !== oldSubjectTagCorrection?.text
        ) {
          if (oldSubjectTagCorrection && oldSubjectTagCorrection.text) {
            this.deleteTagCorrectionDecision(subject, oldSubjectTagCorrection);
          }

          this.handleTagCorrectionDecision(subject);
        }
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

    const apiRequest = this.verificationApi.createOrUpdate(verification);

    // I use firstValueFrom so that the observable is evaluated
    // but I don't have to subscribe or unsubscribe.
    // Additionally, notice that the function is not awaited so that the
    // render thread can continue to run while the request is being made
    firstValueFrom(apiRequest);
  }

  private deleteVerificationDecision(subjectWrapper: SubjectWrapper): void {
    const audioEvent = subjectWrapper.subject as any as AudioEvent;
    const newTag = subjectWrapper.newTag as any;

    const apiRequest = this.verificationApi.destroyUserVerification(
      audioEvent,
      newTag,
    );

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
    const newTag = subjectWrapper.newTag as any;

    const correction = new TaggingCorrection({
      audioEvent,
      correctTagId: newTag.tag.id,
    });

    const apiRequest = this.tagCorrections.create(correction).pipe(
      map((correctTagging: Tagging) => {
        this.sessionTagCorrections.set(audioEvent.id, correctTagging);
        return correctTagging;
      }),
    );

    firstValueFrom(apiRequest);
  }

  private deleteTagCorrectionDecision(
    subjectWrapper: SubjectWrapper,
    tagToRemove: Tag,
  ): void {
    const audioEvent = subjectWrapper.subject as any;

    const targetTagging = this.sessionTagCorrections.get(audioEvent.id);
    if (!targetTagging) {
      // This condition can trigger if users make a request to update a tagging
      // while there is an existing tagging request pending.
      console.error(
        "Could not find tagging for existing audio event correction",
      );
      return;
    }

    const correction = new TaggingCorrection({
      audioEvent,
      correctTagId: tagToRemove.id,
    });

    const apiRequest = this.tagCorrections.destroy(correction, targetTagging.id);
    firstValueFrom(apiRequest);
  }

  // TODO: this function can be improved with instanceof checks once we export
  // data model constructors from the web components
  // see: https://github.com/ecoacoustics/web-components/issues/303
  private isDecisionEvent(
    event: Event,
  ): event is CustomEvent<DecisionMadeEvent> {
    if (!(event instanceof CustomEvent)) {
      return false;
    }

    return event.detail instanceof Map;
  }

  private scrollToVerificationGrid(): void {
    this.scrollService.scrollToElement(this.verificationGridElement(), {
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

  // TODO: This "when" predicate should not be needed once we support optional
  // verifications in the web components.
  // see: https://github.com/ecoacoustics/web-components/issues/444
  private tagVerificationPredicate(): WhenPredicate {
    // The user can only verify a tag if there is a tag applied to the subject.
    return (subject: SubjectWrapper) => subject.tag !== null;
  }

  private addTagWhenPredicate(): WhenPredicate {
    return (subject: SubjectWrapper) => {
      // If there is no tag applied to the subject, we cannot perform a tag
      // correction task.
      if (subject.tag === null) {
        return false;
      }

      // This checks if the verification is not required (symbol) or if there
      // is no verification.
      //
      // TODO: We should improve the "not required" case here once we export the
      // "decisionNotRequired" symbol from the web components.
      // see: https://github.com/ecoacoustics/web-components/issues/500
      const subjectVerification = subject.verification;
      if (typeof subjectVerification === "symbol" || !subjectVerification) {
        return false;
      }

      // If the user verified the original tag as incorrect, we want to prompt
      // them for a new tag.
      return subjectVerification.confirmed === "false";
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
    renderMode: RenderMode.Client,
  };
}

VerificationComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { VerificationComponent };
