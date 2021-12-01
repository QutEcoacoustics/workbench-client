import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel, unknownViewUrl } from "@models/AbstractModel";
import { isDeletedUser, isUnknownUser } from "@models/User";

// TODO Pass model to content through context
@Component({
  selector: "baw-model-link",
  template: `
    <!-- Loading text -->
    <ng-container *ngIf="model | isUnresolved; else resolved">
      <ng-content select="#unresolved"></ng-content>
    </ng-container>

    <ng-template #resolved>
      <!-- Normal model with view url -->
      <a *ngIf="!isGhostUser && hasViewUrl" [bawUrl]="model.viewUrl">
        <ng-content select="#model"></ng-content>
      </a>

      <!-- Abstract Model without view url -->
      <ng-container *ngIf="!isGhostUser && !hasViewUrl">
        <ng-content select="#model"></ng-content>
      </ng-container>

      <!-- Ghost user model -->
      <ng-container *ngIf="isGhostUser">
        <ng-content select="#ghost"></ng-content>
      </ng-container>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelLinkComponent implements OnChanges {
  @Input() public model: AbstractModel;

  public isGhostUser: boolean;
  public hasViewUrl: boolean;

  public ngOnChanges(): void {
    this.isGhostUser = isDeletedUser(this.model) || isUnknownUser(this.model);
    this.hasViewUrl = this.safelyDetermineViewUrl();
  }

  private safelyDetermineViewUrl() {
    // Some viewUrl methods return errors
    try {
      return (
        isInstantiated(this.model.viewUrl) &&
        this.model.viewUrl !== unknownViewUrl
      );
    } catch (err) {
      return false;
    }
  }
}
