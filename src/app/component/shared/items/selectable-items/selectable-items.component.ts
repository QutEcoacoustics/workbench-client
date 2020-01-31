import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-selectable-items",
  templateUrl: "./selectable-items.component.html",
  styles: [
    `
      button[disabled] {
        cursor: not-allowed;
      }
    `
  ]
})
export class SelectableItemsComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() options: ISelectableItem[];
  @Input() selected: ISelectableItem;
  @Output() change = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  changeSelection(option: ISelectableItem) {
    this.selected = option;
    this.change.next(this.selected);
  }

  isSelected(option: ISelectableItem) {
    return this.selected === option;
  }
}

export interface ISelectableItem {
  label: string;
  value: any;
}
