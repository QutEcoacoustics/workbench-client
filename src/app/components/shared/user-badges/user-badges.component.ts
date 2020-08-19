import { ChangeDetectorRef, Component, Input, OnChanges } from "@angular/core";
import { AccountsService } from "@baw-api/account/accounts.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";
import { List } from "immutable";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { DateTimeTimezone } from "src/app/interfaces/apiInterfaces";
import { User } from "src/app/models/User";
import { Badge } from "./user-badge/user-badge.component";

/**
 * App User Badges Component.
 * A group of user badge permissions for a model.
 */
@Component({
  selector: "baw-user-badges",
  template: `
    <div>
      <baw-user-badge
        *ngFor="let badge of badges"
        [label]="badge.label"
        [users]="badge.users"
        [loading]="badge.loading"
        [lengthOfTime]="badge.lengthOfTime"
      ></baw-user-badge>
    </div>
  `,
  styleUrls: ["./user-badges.component.scss"],
})
export class UserBadgesComponent extends WithUnsubscribe()
  implements OnChanges {
  @Input() public model: AbstractModel;
  public badges: Badge[];
  private badgeTypes = [
    {
      id: "creatorId",
      timestamp: "createdAt",
      label: "Created By",
    },
    {
      id: "updaterId",
      timestamp: "updatedAt",
      label: "Updated By",
    },
    {
      id: "ownerId",
      timestamp: "ownedAt",
      label: "Owned By",
    },
  ];

  constructor(private api: AccountsService, private ref: ChangeDetectorRef) {
    super();
  }

  public ngOnChanges() {
    this.badges = [];

    this.badgeTypes.forEach((badgeType) => {
      if (!isInstantiated(this.model[badgeType.id])) {
        return;
      }

      const index =
        this.badges.push({ label: badgeType.label, loading: true }) - 1;
      this.ref.detectChanges();

      // TODO Don't make call if previously made
      this.api.show(this.model[badgeType.id]).subscribe(
        (user: User) => {
          const timestamp: DateTimeTimezone = this.model[badgeType.timestamp];

          this.badges[index].loading = false;
          this.badges[index].users = List([user]);
          this.badges[index].lengthOfTime = timestamp?.toRelative();
          this.ref.detectChanges();
        },
        () => {
          this.badges[index].loading = false;
          this.badges[index].users = List([]);
          this.ref.detectChanges();
        }
      );
    });
  }
}
