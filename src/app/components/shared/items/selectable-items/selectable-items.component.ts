import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
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
  @Input() public title: string;
  @Input() public description: string;
  @Input() public options: ISelectableItem[];
  @Input() public selection: T;
  @Input() public inline = false;
  @Input() public disabled = false;
  @Output() public selectionChange = new EventEmitter<T>();

  protected changeSelection(item: T) {
    this.selectionChange.next(item);
  }

  protected isSelected(item: T): boolean {
    return this.selection === item;
  }
}

export interface ISelectableItem {
  label: string;
  value: any;
}
