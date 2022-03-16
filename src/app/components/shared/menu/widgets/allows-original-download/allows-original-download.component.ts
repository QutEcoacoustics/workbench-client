import { Component, OnInit } from "@angular/core";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { Project } from "@models/Project";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { map, Observable } from "rxjs";

@Component({
  selector: "baw-allows-original-download",
  template: `
    <section *ngIf="project$ | async as project">
      <h5>Allow Original Downloads</h5>
      <p>{{ project?.allowOriginalDownload ? "Yes" : "No" }}</p>
    </section>
  `,
})
export class AllowsOriginalDownloadComponent implements OnInit {
  public project$: Observable<Project>;

  public constructor(private sharedRoute: SharedActivatedRouteService) {}

  public ngOnInit(): void {
    this.project$ = this.sharedRoute.pageInfo.pipe(
      map((page) => retrieveResolvedModel(page, Project))
    );
  }
}
