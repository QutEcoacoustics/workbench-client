import { Component, EventEmitter, Input, Output } from "@angular/core";

/**
 * Selectable Items Component.
 * This creates a list of items for a user to choose from.
 */
@Component({
  selector: "baw-selectable-items",
  templateUrl: "./selectable-items.component.html",
  styles: [
    `
      button {
        height: 100%;
      }

      button[disabled] {
        cursor: not-allowed;
      }
    `,
  ],
})
export class SelectableItemsComponent {
  @Input() public title: string;
  @Input() public description: string;
  @Input() public options: ISelectableItem[];
  @Input() public selection: number;
  @Input() public inline = false;
  @Input() public disabled = false;
  @Output() public selectionChange = new EventEmitter<number>();

  public changeSelection(index: number) {
    this.selection = index;
    this.selectionChange.next(this.selection);
  }

  public isSelected(index: number): boolean {
    return this.selection === index;
  }
}

export interface ISelectableItem {
  label: string;
  value: any;
}
