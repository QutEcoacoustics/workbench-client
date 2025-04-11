import { Component, Input } from "@angular/core";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { NgClass } from "@angular/common";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ClipboardModule } from "ngx-clipboard";

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
        class="text-center form-control">{{ visible ? content : "..." }}@if (visible) {<ng-content></ng-content>}</pre>

      <!--
        We use a manual trigger for the "Copied!" tooltip so that so that it is
        only triggered by the cbOnSuccess event.

        We also add the container="body" so that the tooltip can go above this
        components top level container.

        We can't add the ngbTooltip with the ngxClipboard directive otherwise
        the content fails to copy.
      -->
      <span #copyTooltip="ngbTooltip" ngbTooltip="Copied!" triggers="manual" container="body">
        <button
          id="copy-btn"
          class="btn"
          [ngClass]="'btn-outline-' + color"
          [disabled]="disabled"
          ngxClipboard
          [cbContent]="value"
          (cbOnSuccess)="copyTooltip.open()"
        >
          <fa-icon id="copy-icon" [icon]="['fas', 'copy']"></fa-icon>
        </button>
      </span>
    </div>
  `,
  styles: [
    `
      #auth-token pre {
        margin: 0;
        white-space: pre-wrap;
      }

      /*
      In bootstrap, any element that is inside the same form-control has
      its edge border radius set to 0 so that all inner form-control
      elements are flush.
      However, because we have wrapped the copy-btn inside a tooltip <span>,
      bootstrap attempts to flatten the span's border radius (which is not
      visible) instead of the copy buttons.
      to keep consistent with the bootstrap styling, I manually flatten the
      left edges of the copy button.
    */
      #copy-btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    `,
  ],
  imports: [NgClass, NgbTooltip, FaIconComponent, ClipboardModule],
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
