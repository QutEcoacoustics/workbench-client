import { Component, Input, OnInit } from "@angular/core";
import { BootstrapColorTypes, BootstrapScreenSizes } from "@helpers/bootstrapTypes";

/**
 * Loading Animation
 */
@Component({
  selector: "baw-loading",
  template: `
    <div class="d-flex justify-content-center m-0 p-0">
      <div id="spinner" role="status" [ngClass]="spinnerClass">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `,
  standalone: false,
})
export class LoadingComponent implements OnInit {
  @Input() public color: BootstrapColorTypes = "info";
  @Input() public size: BootstrapScreenSizes = "md";
  @Input() public type: "border" | "grower" = "border";

  public spinnerClass: { [klass: string]: true };

  public ngOnInit(): void {
    this.spinnerClass = {
      [`spinner-${this.type}`]: true,
      [`spinner-${this.type}-${this.size}`]: true,
      [`text-${this.color}`]: true,
    };
  }
}
