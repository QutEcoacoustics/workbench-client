import { Component, OnInit } from "@angular/core";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { titleCase } from "@helpers/case-converter/case-converter";
import { hasRequiredAccessLevelOrHigher } from "@interfaces/apiInterfaces";
import { WidgetComponent } from "@menu/widget.component";
import { Project } from "@models/Project";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { map, Observable } from "rxjs";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "baw-allows-original-download",
  template: `
    <!-- ng-container needed because otherwise ExpressionChangedAfterItHasBeenCheckedError is thrown -->
    @if (project$) {
      @if (project$ | async; as project) {
        <section class="pb-3">
          <p id="label" class="m-0 fs-5">Recording Downloads</p>
          <small
            id="has-access"
            class="m-0"
            [ngbTooltip]="getTooltip(project)"
            [innerText]="getUserAccess(project)"
            >
          </small>
        </section>
      }
    }
  `,
  imports: [NgbTooltip, AsyncPipe],
})
export class AllowsOriginalDownloadComponent
  implements OnInit, WidgetComponent
{
  public constructor(private sharedRoute: SharedActivatedRouteService) {}

  public project$: Observable<Project>;

  public ngOnInit(): void {
    this.project$ = this.sharedRoute.pageInfo.pipe(
      map((page): Project | undefined => retrieveResolvedModel(page, Project))
    );
  }

  public getTooltip(project: Project): string {
    const { name, allowOriginalDownload } = project;

    return allowOriginalDownload
      ? `Owner of ${name} has allowed downloads of the audio recordings for ${titleCase(
          allowOriginalDownload
        )}s`
      : `Owner of ${name} has not set any permissions for allowing the downloads of the audio recordings yet`;
  }

  public getUserAccess(project: Project): string {
    const { allowOriginalDownload, accessLevel } = project;

    return allowOriginalDownload &&
      hasRequiredAccessLevelOrHigher(allowOriginalDownload, accessLevel)
      ? "Allowed"
      : "Not Allowed";
  }
}
