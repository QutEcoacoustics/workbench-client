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
        id="visibility-btn"
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
        class="text-center form-control">{{ visible ? content : "..." }}<ng-content *ngIf="visible"></ng-content></pre>

      <button
        #copyTooltip="ngbTooltip"
        id="copy-btn"
        type="button"
        class="btn"
        triggers="manual"
        container="body"
        ngbTooltip="Copied!"
        [ngClass]="'btn-outline-' + color"
        [disabled]="disabled"
      >
        <!-- ! Be careful changing how the clipboard works. It is not tested -->
        <span
          ngxClipboard
          [cbContent]="value"
          (cbOnSuccess)="copyTooltip.open()"
        >
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
  @Input() public content: string;
  public visible: boolean;

  public toggleVisibility() {
    this.visible = !this.visible;
  }
}
