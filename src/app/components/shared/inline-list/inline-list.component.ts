import { NgIfContext } from "@angular/common";
import { Component, Input, TemplateRef } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";

@Component({
  selector: "baw-inline-list",
  template: `
    <ng-container *ngIf="!!items; else emptyTemplate">
      <span *ngFor="let item of items; last as isLast">
        <a [href]="item.viewUrl">{{ itemText(item) }}</a>
      </span>
    </ng-container>
  `
})
export class InlineListComponent {
  public constructor() {}

  @Input() public items: AbstractModel[];
  @Input() public emptyTemplate: TemplateRef<NgIfContext<boolean>>;
  @Input() public itemKey?: string;

  protected itemText(item: AbstractModel): string {
    if (isInstantiated(this.itemKey)) {
      return item[this.itemKey];
    }

    return item.toString();
  }
}
