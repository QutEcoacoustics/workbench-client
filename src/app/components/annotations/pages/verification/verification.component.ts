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
import { firstValueFrom, takeUntil } from "rxjs";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { Filters } from "@baw-api/baw-api.service";
import { Verification } from "@models/Verification";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/components/verification-grid/verification-grid";
import { TagsService } from "@baw-api/tag/tags.service";
import { StrongRoute } from "@interfaces/strongRoute";
import { ResetProgressWarningComponent } from "@components/annotations/components/reset-progress-warning/reset-progress-warning";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchParameters } from "../annotationSearchParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

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

    private modals: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private injector: Injector
  ) {
    super();
  }

  public searchParameters: AnnotationSearchParameters;
  public searchFormParameters: AnnotationSearchParameters;
  public areParametersCollapsed = true;
  public project: Project;
  public region?: Region;
  public site?: Site;
  public previewAudioEvents: Verification[] = [];
  public previewPage = 1;
  public previewSize = 3;
  protected hasShownVerificationGrid = false;
  protected hasShownPreview = false;

  @ViewChild("progressWarningModal")
  private lostProgressWarningModal: ElementRef<ResetProgressWarningComponent>;

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
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params: Params) => {
        this.searchParameters = new AnnotationSearchParameters(
          params,
          this.injector
        );
      });

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

    if (this.areParametersCollapsed) {
      this.hasShownVerificationGrid = true;
    } else {
      this.hasShownPreview = true;
    }
  }

  public ngAfterViewInit(): void {
    this.updateGridCallback();
  }

  protected handleSpectrogramLoaded(): void {
    this.verificationGridElement.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  protected requestToggleParameters(): void {
    if (this.shouldUpdatePagingCallback()) {
      this.modals.open(this.lostProgressWarningModal);
      return;
    }

    this.toggleParameters();
  }

  protected toggleParameters(): void {
    this.areParametersCollapsed = !this.areParametersCollapsed;

    if (this.areParametersCollapsed) {
      this.updateGridCallback();
      this.updateUrlParameters();
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
      const items: Verification[] = await firstValueFrom(serviceObservable);

      return new Object({
        subjects: items,
        context: { page: 1 },
        totalItems: items.length,
      });
    };
  }

  protected shouldUpdatePagingCallback(): boolean {
    const hasChangedParameters = !!this.searchParameters.tagModels.length;
    const areParametersOpen = !this.areParametersCollapsed;
    return hasChangedParameters && areParametersOpen;
  }

  private updateGridCallback(): void {
    if (!this.verificationGridElement) {
      console.error("Could not find verification grid element");
      return;
    }

    this.verificationGridElement.nativeElement.getPage = this.getPageCallback();
  }

  private filterConditions(_pagedItems: number): Filters<Verification> {
    return this.searchParameters.toFilter();
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
    },
    fullscreen: true,
  };
}

VerificationComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { VerificationComponent };
