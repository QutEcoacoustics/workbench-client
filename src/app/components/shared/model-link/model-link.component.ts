import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";
import { User } from "@models/User";

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
        <ng-container *ngTemplateOutlet="modelTemplate"></ng-container>
      </a>

      <!-- Abstract Model without view url -->
      <ng-container *ngIf="!isGhostUser && !hasViewUrl">
        <ng-container *ngTemplateOutlet="modelTemplate"></ng-container>
      </ng-container>

      <!-- Ghost user model -->
      <ng-container *ngIf="isGhostUser">
        <ng-content select="#ghost"></ng-content>
      </ng-container>
    </ng-template>

    <ng-template #modelTemplate>
      <ng-content select="#model"></ng-content>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelLinkComponent implements OnChanges {
  @Input() public model: AbstractModel;

  public isGhostUser: boolean;
  public hasViewUrl: boolean;

  public ngOnChanges(): void {
    this.isGhostUser =
      (this.model as User).isUnknown || (this.model as User).isDeleted;
    this.hasViewUrl = this.safelyDetermineViewUrl();
  }

  private safelyDetermineViewUrl() {
    // Some viewUrl methods return errors
    try {
      return isInstantiated(this.model.viewUrl);
    } catch (err) {
      return false;
    }
  }
}
