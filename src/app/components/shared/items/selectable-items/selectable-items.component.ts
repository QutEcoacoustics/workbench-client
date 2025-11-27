import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

/**
 * Selectable Items Component.
 * This creates a list of items for a user to choose from.
 */
@Component({
  selector: "baw-selectable-items",
  templateUrl: "./selectable-items.component.html",
  styleUrl: "./selectable-items.component.scss",
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectableItemsComponent<T> {
  public readonly title = input<string>();
  public readonly description = input<string>();
  public readonly options = input<ISelectableItem<T>[]>();
  public readonly selection = input<T>();
  public readonly inline = input(false);
  public readonly disabled = input(false);
  public readonly selectionChange = output<T>();

  protected changeSelection(item: T) {
    if (item === this.selection()) {
      return;
    }
    this.selectionChange.emit(item);
  }
}

export interface ISelectableItem<T> {
  label: string;
  value: T;
  disabled?: boolean;
}
