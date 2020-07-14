import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

/**
 * Loading Animation
 */
@Component({
  selector: "baw-loading",
  template: `
    <ng-container *ngIf="isLoading">
      <h4 id="app-loading" class="text-center">Loading</h4>
      <div id="app-spinner" class="d-flex justify-content-center">
        <div class="spinner-border text-info" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  @Input() public isLoading: boolean;

  constructor() {}
}
