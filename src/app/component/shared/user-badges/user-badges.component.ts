import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit
} from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DateTime, ID } from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { User } from "src/app/models/User";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { UserService } from "src/app/services/baw-api/user.service";
import { Badge } from "./user-badge/user-badge.component";

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
export class UserBadgesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() model: Site | Project;

  private unsubscribe = new Subject();
  created: any;
  updated: any;
  owned: any;

  constructor(private api: UserService, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.generateBadges();
  }

  ngOnChanges() {
    this.generateBadges();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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

  generateBadge(object: Badge, id: ID, time?: DateTime) {
    this.api
      .getUserAccount(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (user: User) => {
          object["users"] = List<User>([user]);
          object["lengthOfTime"] = this.getLengthOfTime(time);
          this.ref.detectChanges();
        },
        (err: APIErrorDetails) => {}
      );
  }

  private getLengthOfTime(time: DateTime): string {
    if (time.toString() === new Date("1970-01-01T00:00:00.000").toString()) {
      return undefined;
    }

    const now = new Date();
    const yearDiff = now.getUTCFullYear() - time.getUTCFullYear();
    const monthDiff = now.getUTCMonth() - time.getUTCMonth();
    const dayDiff = now.getUTCDay() - time.getUTCDay();
    const hourDiff = now.getUTCHours() - time.getUTCHours();

    if (yearDiff > 0) {
      return `${yearDiff} years ago`;
    } else if (monthDiff > 0) {
      return `${monthDiff} months ago`;
    } else if (dayDiff > 0) {
      return `${dayDiff} days ago`;
    } else if (hourDiff > 0) {
      return `${hourDiff} hours ago`;
    } else {
      return "Less than an hour ago";
    }
  }
}
