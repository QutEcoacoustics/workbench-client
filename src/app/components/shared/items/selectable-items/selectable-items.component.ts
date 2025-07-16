import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

/**
 * Selectable Items Component.
 * This creates a list of items for a user to choose from.
 */
@Component({
  selector: "baw-selectable-items",
  templateUrl: "./selectable-items.component.html",
  styles: [`
    button {
      height: 100%;
    }

    button[disabled] {
      cursor: not-allowed;
    }
  `],
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectableItemsComponent<T> {
  public title = input<string>();
  public description = input<string>();
  public options = input<ISelectableItem<T>[]>();
  public selection = input<T>();
  public inline = input(false);
  public disabled = input(false);
  public selectionChange = output<T>();

  protected changeSelection(item: T) {
    this.selectionChange.emit(item);
  }

  protected isSelected(item: T): boolean {
    return this.selection() === item;
  }
}

export interface ISelectableItem<T> {
  label: string;
  value: T;
  disabled?: boolean;
}
