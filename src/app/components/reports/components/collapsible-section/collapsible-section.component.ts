import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgbCollapse, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-collapsible-section",
  templateUrl: "./collapsible-section.component.html",
  styleUrl: "./collapsible-section.component.scss",
  imports: [FaIconComponent, NgbCollapse, NgbTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleSectionComponent {
  public readonly sectionTitle = input.required<string>();
  public readonly expanded = input.required<boolean>();
  public readonly headingLevel = input<3 | 4>(4);
  public readonly contentId = input<string>();
  public readonly expandedChange = output<boolean>();

  protected toggle(): void {
    this.expandedChange.emit(!this.expanded());
  }
}
