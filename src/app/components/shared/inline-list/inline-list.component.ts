import { NgIfContext } from "@angular/common";
import { Component, Input, TemplateRef } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";

@Component({
  selector: "baw-inline-list",
  template: `
    @if (!!items && items.length > 0) {
      @for (item of items; track item; let isLast = $last) {
        <span>
          <a [href]="item.viewUrl">{{ itemText(item) }}</a>
          @if (!isLast) {
            ,
          }
        </span>
      }
    } @else {
      <ng-template [ngTemplateOutlet]="emptyTemplate"></ng-template>
    }
  `,
  standalone: false,
})
export class InlineListComponent {
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
