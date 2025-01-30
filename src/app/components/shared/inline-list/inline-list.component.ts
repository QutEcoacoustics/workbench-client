import { NgIfContext } from "@angular/common";
import { Component, Input, TemplateRef } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";

@Component({
  selector: "baw-inline-list",
  template: `
    <ng-container *ngIf="!!items && items.length > 0; else emptyTemplate">
      <span *ngFor="let item of items; last as isLast">
        <a [href]="item[itemLinkKey]">{{ itemText(item) }}</a>
        <ng-container *ngIf="!isLast">, </ng-container>
      </span>
    </ng-container>
  `
})
export class InlineListComponent {
  @Input() public items: AbstractModel[];
  @Input() public emptyTemplate: TemplateRef<NgIfContext<boolean>>;
  @Input() public itemKey?: string;
  @Input() public itemLinkKey: string = "viewUrl";

  protected itemText(item: AbstractModel): string {
    if (isInstantiated(this.itemKey)) {
      return item[this.itemKey];
    }

    return item.toString();
  }
}
