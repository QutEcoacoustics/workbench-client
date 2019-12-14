import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { ID, Time } from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { User } from "src/app/models/User";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { UserService } from "src/app/services/baw-api/user.service";
import { UserBadge } from "../user-badge/user-badge.component";
import { WidgetComponent } from "../widget/widget.component";

@Component({
  selector: "app-permissions-shield",
  template: `
    <div *ngIf="!error">
      <app-user-badge
        [label]="'Created By'"
        [users]="createdBy"
        *ngIf="createdBy"
      ></app-user-badge>
      <app-user-badge
        [label]="'Modified By'"
        [users]="modifiedBy"
        *ngIf="modifiedBy"
      ></app-user-badge>
      <app-user-badge
        [label]="'Owned By'"
        [users]="ownedBy"
        *ngIf="ownedBy"
      ></app-user-badge>
      <h4>Your access level</h4>
      <p>Not Implemented</p>
    </div>
  `,
  styleUrls: ["./permissions-shield.component.scss"]
})
export class PermissionsShieldComponent
  implements OnInit, OnDestroy, WidgetComponent {
  @Input() data: any;

  private subsink = new SubSink();
  createdBy: UserBadge[];
  modifiedBy: UserBadge[];
  ownedBy: UserBadge[];
  error: boolean;

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService,
    private userApi: UserService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.error = true;

    // ! UserBadges are not updating after subscriptions are complete
    // TODO remove nested subscription
    this.subsink.sink = this.route.params.subscribe({
      next: data => {
        this.createdBy = [];
        this.modifiedBy = [];

        if (data.siteId && data.projectId) {
          this.ownedBy = null;
          this.sitesApi
            .getProjectSite(data.projectId, data.siteId)
            .subscribe(this.getUserShields());
        } else if (data.projectId) {
          this.ownedBy = [];
          this.projectsApi
            .getProject(data.projectId)
            .subscribe(this.getUserShields());
        }
      }
    });
  }

  ngOnDestroy() {
    this.subsink.unsubscribe();
  }

  /**
   * Get user shields
   */
  getUserShields() {
    return {
      next: (model: Project | Site) => {
        this.error = false;

        this.getUser(this.createdBy, model.creatorId, model.createdAt);
        this.getUser(this.modifiedBy, model.updaterId, model.updatedAt);

        if (model.kind === "Project") {
          this.getUser(this.ownedBy, model.ownerId, null);
        }
      }
    };
  }

  /**
   * Append user to pointer
   * @param pointer Variable pointer
   * @param id User ID
   * @param time User last edit
   */
  getUser(pointer: UserBadge[], id: ID, time: Time) {
    if (!id) {
      this.ref.detectChanges();
      return;
    }

    this.subsink.sink = this.userApi.getUserAccount(id).subscribe({
      next: (user: User) => {
        pointer.push({ user, time });
        this.ref.detectChanges();
      }
    });
  }

  calculateTimePassed(time: Time) {}
}
