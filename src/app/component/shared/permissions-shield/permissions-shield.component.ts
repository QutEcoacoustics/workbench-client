import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";
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
export class PermissionsShieldComponent
  implements OnInit, OnDestroy, WidgetComponent {
  private unsubscribe = new Subject();
  @Input() data: any;

  error: boolean;
  model: Site | Project;
  ready: boolean;

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.ready = false;

    this.route.params
      .pipe(
        flatMap((params: Params) => {
          if (params.siteId && params.projectId) {
            return this.sitesApi.show(params.projectId, params.siteId);
          } else if (params.projectId) {
            return this.projectsApi.show(params.projectId);
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
