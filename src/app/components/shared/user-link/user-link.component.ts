import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { AbstractModel } from "@models/AbstractModel";
import { isDeletedUser, isUnknownUser } from "@models/User";

// TODO Pass model to content through context
@Component({
  selector: "baw-user-link",
  template: `
    <ng-container *ngIf="user | isUnresolved; else resolved">
      <ng-content select="#unresolved"></ng-content>
    </ng-container>

    <ng-template #resolved>
      <a *ngIf="!isGhostUser; else ghost" [bawUrl]="user.viewUrl">
        <ng-content select="#user"></ng-content>
      </a>

      <ng-template #ghost>
        <ng-content select="#ghost"></ng-content>
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLinkComponent implements OnChanges {
  @Input() public user: AbstractModel;

  public isGhostUser: boolean;

  public ngOnChanges(): void {
    this.isGhostUser = isDeletedUser(this.user) || isUnknownUser(this.user);
  }
}
