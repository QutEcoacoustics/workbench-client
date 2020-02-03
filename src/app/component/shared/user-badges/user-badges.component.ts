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
import {
  DateTimeTimezone,
  defaultDateTimeTimezone,
  Id
} from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { User } from "src/app/models/User";
import { AccountService } from "src/app/services/baw-api/account.service";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";
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

  constructor(private api: AccountService, private ref: ChangeDetectorRef) {}

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
    if (time === defaultDateTimeTimezone) {
      return undefined;
    }

    const diff = time.diffNow(["years", "months", "days"]);
    const years = Math.floor(Math.abs(diff.years));
    const months = Math.floor(Math.abs(diff.months));
    const days = Math.floor(Math.abs(diff.days));

    // Diff values will be negative
    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      return "Less than a day ago";
    }
  }
}
