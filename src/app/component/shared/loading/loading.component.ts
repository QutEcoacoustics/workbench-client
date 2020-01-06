import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "app-loading",
  template: `
    <ng-container *ngIf="isLoading">
      <h4 class="text-center">Loading</h4>
      <div class="d-flex justify-content-center">
        <mat-spinner diameter="30" strokeWidth="4"></mat-spinner>
      </div>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  @Input() isLoading: boolean;

  constructor() {}
}
