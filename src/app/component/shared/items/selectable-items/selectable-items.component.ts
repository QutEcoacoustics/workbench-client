import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

/**
 * Selectable Items Component.
 * This creates a list of items for a user to choose from.
 */
@Component({
  selector: "baw-selectable-items",
  templateUrl: "./selectable-items.component.html",
  styles: [
    `
      button[disabled] {
        cursor: not-allowed;
      }
    `,
  ],
})
export class SelectableItemsComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() options: ISelectableItem[];
  @Input() selected: number;
  @Input() inline = false;
  @Output() selectionChange = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  changeSelection(index: number) {
    this.selected = index;
    this.selectionChange.next(this.selected);
  }

  isSelected(index: number): boolean {
    return this.selected === index;
  }
}

export interface ISelectableItem {
  label: string;
  value: any;
}
