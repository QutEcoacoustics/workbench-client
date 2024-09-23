import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
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
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { VerificationService } from "@baw-api/verification/verification.service";
import { firstValueFrom, takeUntil } from "rxjs";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { Filters } from "@baw-api/baw-api.service";
import { Verification } from "@models/Verification";
import { VerificationGridComponent } from "@ecoacoustics/web-components/@types/src/components/verification-grid/verification-grid";
import { AnnotationSearchParameters } from "../annotationSearchParameters";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";
// const parameterKey = "parameters";

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
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private verificationApi: VerificationService,
    private injector: Injector
  ) {
    super();
  }

  public searchParameters: AnnotationSearchParameters;
  public areParametersCollapsed = true;
  public project: Project;
  public region?: Region;
  public site?: Site;

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
  }

  public ngAfterViewInit(): void {
    this.verificationGridElement.nativeElement.getPage = this.getPageCallback();

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.searchParameters = new AnnotationSearchParameters(
          params,
          this.injector
        );

        this.verificationGridElement.nativeElement.getPage =
          this.getPageCallback();
      });
  }

  protected toggleParameters(): void {
    this.areParametersCollapsed = !this.areParametersCollapsed;
  }

  protected getPageCallback(): any {
    return async (pagedItems: number) => {
        const filters = this.filterConditions(pagedItems);
        const serviceObservable = this.verificationApi.filter(filters);
        const items = await firstValueFrom(serviceObservable);

        return new Object({
        subjects: items,
        context: { page: 1 },
        totalItems: items.length,
      });
    }
  }

  protected updateModel(newModel: AnnotationSearchParameters): void {
    this.searchParameters = newModel;
    this.updateSearchParameters();
    this.verificationGridElement.nativeElement.getPage = this.getPageCallback();
  }

  private filterConditions(_pagedItems: number): Filters<Verification> {
    return this.searchParameters.toFilter();
  }

  private updateSearchParameters(): void {
    const queryParams = this.searchParameters.toQueryParams();
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
    },
  };
}

VerificationComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"));

export { VerificationComponent };
