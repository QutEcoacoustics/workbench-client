import { Component, Input } from "@angular/core";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";

/**
 * Loading Animation
 */
@Component({
  selector: "baw-hidden-copy",
  template: `
    <div id="auth-token" class="input-group">
      <button
        type="button"
        class="btn"
        container="body"
        [ngClass]="'btn-outline-' + color"
        [ngbTooltip]="disabled ? disabled : tooltip"
        [disabled]="disabled"
        [class.active]="visible"
        (click)="toggleVisibility()"
      >
        <fa-icon [icon]="['fas', 'eye']"></fa-icon>
      </button>

      <pre
        class="text-center form-control">{{ visible ? value : "..." }}<ng-content *ngIf="visible"></ng-content></pre>

      <button
        type="button"
        class="btn"
        [ngbTooltip]="disabled ? disabled : 'Copied!'"
        triggers="click"
        container="body"
        [ngClass]="'btn-outline-' + color"
        [disabled]="disabled"
      >
        <span ngxClipboard [cbContent]="value">
          <fa-icon [icon]="['fas', 'copy']"></fa-icon>
        </span>
      </button>
    </div>
  `,
  styles: [
    `
      #auth-token pre {
        margin: 0;
        white-space: pre-wrap;
      }
    `,
  ],
})
export class HiddenCopyComponent {
  @Input() public color: BootstrapColorTypes = "secondary";
  @Input() public tooltip: string;
  @Input() public disabled: string | undefined;
  @Input() public value: string;
  public visible: boolean;

  public toggleVisibility() {
    this.visible = !this.visible;
  }
}
