import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";
import { User } from "@models/User";
import { NgTemplateOutlet } from "@angular/common";
import { UrlDirective } from "../../../../directives/url/url.directive";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";

// TODO Pass model to content through context
@Component({
    selector: "baw-model-link",
    template: `
    <!-- Loading text -->
    @if (model | isUnresolved) {
      <ng-content select="#unresolved"></ng-content>
    } @else {
      <!-- Normal model with view url -->
      @if (!isGhostUser && hasViewUrl) {
        <a [bawUrl]="model.viewUrl">
          <ng-container *ngTemplateOutlet="modelTemplate"></ng-container>
        </a>
      }

      <!-- Abstract Model without view url -->
      @if (!isGhostUser && !hasViewUrl) {
        <ng-container *ngTemplateOutlet="modelTemplate"></ng-container>
      }

      <!-- Ghost user model -->
      @if (isGhostUser) {
        <ng-content select="#ghost"></ng-content>
      }
    }

    <ng-template #modelTemplate>
      <ng-content select="#model"></ng-content>
    </ng-template>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UrlDirective, NgTemplateOutlet, IsUnresolvedPipe]
})
export class ModelLinkComponent implements OnChanges {
  @Input() public model: AbstractModel;

  public isGhostUser: boolean;
  public hasViewUrl: boolean;

  public ngOnChanges(): void {
    this.isGhostUser = (this.model as User).isGhost;
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
