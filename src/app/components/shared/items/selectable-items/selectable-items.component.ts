import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Selectable Items Component.
 * This creates a list of items for a user to choose from.
 */
@Component({
  selector: 'baw-selectable-items',
  templateUrl: './selectable-items.component.html',
  styles: [
    `
      button[disabled] {
        cursor: not-allowed;
      }
    `,
  ],
})
export class SelectableItemsComponent implements OnInit {
  @Input() public title: string;
  @Input() public description: string;
  @Input() public options: ISelectableItem[];
  @Input() public selected: number;
  @Input() public inline = false;
  @Output() public selectionChange = new EventEmitter<number>();

  constructor() {}

  public ngOnInit() {}

  public changeSelection(index: number) {
    this.selected = index;
    this.selectionChange.next(this.selected);
  }

  public isSelected(index: number): boolean {
    return this.selected === index;
  }
}

export interface ISelectableItem {
  label: string;
  value: any;
}
