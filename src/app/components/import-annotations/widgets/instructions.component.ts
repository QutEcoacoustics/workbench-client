import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { WidgetComponent } from "@menu/widget.component";
import { WidgetMenuItem } from "@menu/widgetItem";

@Component({
  selector: "baw-import-instructions",
  templateUrl: "./instructions.component.html",
  styleUrl: "./instructions.component.scss",
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportInstructionsWidgetComponent implements WidgetComponent {
  public errors: string[] = [""];
  public warnings: string[] = [""];

  public hasError(error: string): boolean {
    return true;
  }

  public hasWarning(warning: string): boolean {
    return true;
  }
}

export const importAnnotationsWidgetMenuItem = new WidgetMenuItem(
  ImportInstructionsWidgetComponent,
);
