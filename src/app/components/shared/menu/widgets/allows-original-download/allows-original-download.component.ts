import { Component, OnInit } from "@angular/core";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { titleCase } from "@helpers/case-converter/case-converter";
import { hasRequiredAccessLevelOrHigher } from "@interfaces/apiInterfaces";
import { WidgetComponent } from "@menu/widget.component";
import { Project } from "@models/Project";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { map, Observable, tap } from "rxjs";

@Component({
  selector: "baw-allows-original-download",
  template: `
    <section *ngIf="project$ | async as project" class="pb-3">
      <p id="label" class="m-0 fs-5">Recording Downloads</p>
      <small
        id="has-access"
        class="m-0"
        [ngbTooltip]="tooltip"
        [innerText]="hasAccess ? 'Allowed' : 'Not Allowed'"
      >
      </small>
    </section>
  `,
})
export class AllowsOriginalDownloadComponent
  implements OnInit, WidgetComponent
{
  public project$: Observable<Project>;
  public hasAccess: boolean;
  public tooltip: string;

  public constructor(private sharedRoute: SharedActivatedRouteService) {}

  public ngOnInit(): void {
    this.project$ = this.sharedRoute.pageInfo.pipe(
      map((page): Project | undefined => retrieveResolvedModel(page, Project)),
      tap((project: Project | undefined) => {
        if (!project) {
          this.tooltip = "";
          this.hasAccess = false;
        } else {
          this.tooltip = this.getTooltip(project);
          this.hasAccess = this.determineIfUserHasAccess(project);
        }
      })
    );
  }

  private getTooltip(project: Project): string {
    const { name, allowOriginalDownload } = project;

    return allowOriginalDownload
      ? `Owner of ${name} has allowed downloads of the audio recordings for ${titleCase(
          allowOriginalDownload
        )}s`
      : `Owner of ${name} has not set any permissions for allowing the downloads of the audio recordings yet`;
  }

  private determineIfUserHasAccess(project: Project): boolean {
    const { allowOriginalDownload, accessLevel } = project;
    return allowOriginalDownload
      ? hasRequiredAccessLevelOrHigher(allowOriginalDownload, accessLevel)
      : false;
  }
}
