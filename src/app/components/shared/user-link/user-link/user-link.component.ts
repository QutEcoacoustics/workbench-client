import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { User } from "@models/User";

@Component({
  selector: "baw-user-link",
  template: `
    <!-- Loading text -->
    <ng-container *ngIf="user | isUnresolved; else resolved">
      <baw-loading size="sm"></baw-loading>
    </ng-container>

    <ng-template #resolved>
      <!-- Show username -->
      <a
        *ngIf="!user.isGhost; else ghostUser"
        [bawUrl]="user.viewUrl"
        [innerText]="user.userName"
      ></a>

      <!-- Show ghost user -->
      <ng-template #ghostUser>
        <span [innerText]="user.userName"></span>
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLinkComponent {
  @Input() public user: User;
  // TODO Potentially add the ability for different styles, ie. link/badge/card
}
