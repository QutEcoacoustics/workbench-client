import { ChangeDetectionStrategy, Component, input, signal } from "@angular/core";
import { BootstrapColorTypes } from "@helpers/bootstrapTypes";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ClipboardModule } from "ngx-clipboard";

@Component({
  selector: "baw-hidden-copy",
  templateUrl: "./hidden-copy.component.html",
  styleUrl: "./hidden-copy.component.scss",
  imports: [NgbTooltip, FaIconComponent, ClipboardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HiddenCopyComponent {
  public readonly color = input<BootstrapColorTypes>("secondary");
  public readonly tooltip = input<string>();
  public readonly disabled = input<string | undefined>();
  public readonly value = input<string>();
  public readonly content = input<string>();

  public readonly visible = signal(false);

  protected toggleVisibility() {
    this.visible.update((visible) => !visible);
  }
}
