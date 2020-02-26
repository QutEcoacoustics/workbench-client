import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { flatMap, takeUntil } from "rxjs/operators";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { WidgetComponent } from "../widget/widget.component";

@Component({
  selector: "app-permissions-shield",
  template: `
    <div *ngIf="ready">
      <app-user-badges [model]="model" *ngIf="model"></app-user-badges>
      <h4>Your access level</h4>
      <p>Not Implemented</p>
    </div>
  `,
  styleUrls: ["./permissions-shield.component.scss"]
})
export class PermissionsShieldComponent extends WithUnsubscribe()
  implements OnInit, WidgetComponent {
  @Input() data: any;

  error: boolean;
  model: Site | Project;
  ready: boolean;

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.ready = false;

    this.route.params
      .pipe(
        flatMap((params: Params) => {
          if (params.siteId && params.projectId) {
            return this.sitesApi.show(params.projectId, params.siteId);
          } else if (params.projectId) {
            return this.projectsApi.show(params.projectId);
          } else {
            throw Error("No parameters found in url");
          }
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (model: Site | Project) => {
          this.model = model;
          this.ready = true;
          this.ref.detectChanges();
        },
        (err: ApiErrorDetails) => {
          console.error("PermissionsShieldComponent: ", err);
        }
      );
  }
}
