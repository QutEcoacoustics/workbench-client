import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { map, mergeAll, mergeMap, switchAll, switchMap } from "rxjs/operators";
import {
  ID,
  Time,
  TimezoneInformation
} from "src/app/interfaces/apiInterfaces";
import { User } from "src/app/models/User";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { UserService } from "src/app/services/baw-api/user.service";
import { WidgetComponent } from "../widget/widget.component";

@Component({
  selector: "app-permissions-shield",
  templateUrl: "./permissions-shield.component.html",
  styleUrls: ["./permissions-shield.component.scss"]
})
export class PermissionsShieldComponent implements OnInit, WidgetComponent {
  @Input() data: any;

  createdBy: { user: User; time: Time }[] = [];
  modifiedBy: { user: User; time: Time }[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private userApi: UserService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // TODO remove nested subscription
    this.route.params.subscribe({
      next: data => {
        this.projectsApi.getProject(data.projectId).subscribe(project => {
          this.createdBy = [];
          this.modifiedBy = [];

          this.getUser(this.createdBy, project.creatorId, project.createdAt);

          if (project.updaterId) {
            this.getUser(this.modifiedBy, project.creatorId, project.createdAt);
          }
        });
      }
    });
  }

  getUser(pointer: { user: User; time: Time }[], id: ID, time: Time) {
    const subscription = this.userApi
      .getUserAccount(id)
      .subscribe((user: User) => {
        pointer.push({
          user,
          time
        });
        subscription.unsubscribe();
        this.ref.detectChanges();
      });
  }
}
