import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit
} from "@angular/core";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { DateTimeTimezone, Id } from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { User } from "src/app/models/User";
import { AccountService } from "src/app/services/baw-api/account.service";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { Badge } from "./user-badge/user-badge.component";

/**
 * App User Badges Component.
 * A group of user badge permissions for a model.
 */
@Component({
  selector: "app-user-badges",
  template: `
    <div>
      <app-user-badge
        *ngIf="created"
        [label]="created.label"
        [users]="created.users"
        [lengthOfTime]="created.lengthOfTime"
      ></app-user-badge>
      <app-user-badge
        *ngIf="updated"
        [label]="updated.label"
        [users]="updated.users"
        [lengthOfTime]="updated.lengthOfTime"
      ></app-user-badge>
      <app-user-badge
        *ngIf="owned"
        [label]="owned.label"
        [users]="owned.users"
        [lengthOfTime]="owned.lengthOfTime"
      ></app-user-badge>
    </div>
  `,
  styleUrls: ["./user-badges.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBadgesComponent extends WithUnsubscribe()
  implements OnInit, OnChanges {
  @Input() model: Site | Project;

  created: any;
  updated: any;
  owned: any;

  constructor(private api: AccountService, private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.generateBadges();
  }

  ngOnChanges() {
    this.generateBadges();
  }

  generateBadges() {
    if (this.model.creatorId) {
      this.created = { label: "Created By" };

      this.generateBadge(
        this.created,
        this.model.creatorId,
        this.model.createdAt
      );
    } else {
      this.created = undefined;
    }

    if (this.model.updaterId) {
      this.updated = { label: "Updated By" };
      this.generateBadge(
        this.updated,
        this.model.updaterId,
        this.model.updatedAt
      );
    } else {
      this.updated = undefined;
    }

    if (this.model.kind === "Project" && this.model.ownerId) {
      this.owned = { label: "Owned By" };
      this.generateBadge(this.owned, this.model.ownerId);
    } else {
      this.owned = undefined;
    }
  }

  generateBadge(object: Badge, id: Id, time?: DateTimeTimezone) {
    this.api
      .show(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (user: User) => {
          object["users"] = List<User>([user]);
          if (time) {
            object["lengthOfTime"] = this.getLengthOfTime(time);
          }
          this.ref.detectChanges();
        },
        (err: ApiErrorDetails) => {}
      );
  }

  private getLengthOfTime(time: DateTimeTimezone): string {
    return time ? time.toRelative() : undefined;
  }
}
