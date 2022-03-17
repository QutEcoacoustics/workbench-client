import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import {
  faSquareCheck,
  faTimes,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { titleCase } from "@helpers/case-converter/case-converter";
import { IPageInfo } from "@helpers/page/pageInfo";
import { hasRequiredAccessLevelOrHigher } from "@interfaces/apiInterfaces";
import { WidgetComponent } from "@menu/widget.component";
import { Project } from "@models/Project";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { map, Observable } from "rxjs";

@Component({
  selector: "baw-allows-original-download",
  template: `
    <section
      *ngIf="project$ | async as project"
      class="d-flex justify-content-between pb-3"
      [ngbTooltip]="getTooltip(project)"
    >
      <span>Allows Downloads</span>
      <fa-icon [icon]="getIcon(project)" [class]="getColor(project)"></fa-icon>
    </section>
  `,
})
export class AllowsOriginalDownloadComponent
  implements OnInit, WidgetComponent
{
  public project$: Observable<Project>;
  public pageData: IPageInfo;

  public constructor(
    private sharedRoute: SharedActivatedRouteService,
    private ref: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.project$ = this.sharedRoute.pageInfo.pipe(
      map((page): Project => retrieveResolvedModel(page, Project))
    );
    this.ref.detectChanges();
  }

  public getIcon(project: Project): IconDefinition {
    return project.allowOriginalDownload ? faSquareCheck : faTimes;
  }

  public getColor(project: Project) {
    const { allowOriginalDownload, accessLevel } = project;

    if (
      allowOriginalDownload &&
      hasRequiredAccessLevelOrHigher(allowOriginalDownload, accessLevel)
    ) {
      return "text-success";
    } else {
      return "text-danger";
    }
  }

  public getTooltip(project: Project): string {
    const { allowOriginalDownload, name } = project;

    if (!allowOriginalDownload) {
      return `Owner of ${name} has not set any permissions for allowing the downloads of the audio recordings yet`;
    }

    return `Owner of ${name} has allowed downloads of the audio recordings for ${titleCase(
      allowOriginalDownload
    )}s`;
  }
}
