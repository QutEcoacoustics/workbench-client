import { NgIfContext, NgTemplateOutlet } from "@angular/common";
import { Component, input, TemplateRef } from "@angular/core";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";

@Component({
  selector: "baw-inline-list",
  template: `
    @if (!!items && items.length > 0) {
      @for (item of items(); track item; let isLast = $last) {
        <span>
          <a [href]="item.viewUrl">{{ itemText(item) }}</a>
          @if (!isLast) {, }
        </span>
      }
    } @else {
      <ng-template [ngTemplateOutlet]="emptyTemplate()"></ng-template>
    }
  `,
  imports: [NgTemplateOutlet],
})
export class InlineListComponent {
  public items = input.required<AbstractModel[]>();
  public withLoading = input(false);
  public emptyTemplate = input<TemplateRef<NgIfContext<boolean>>>();
  public itemKey = input<string>();

  protected itemText(item: AbstractModel): string {
    if (isInstantiated(this.itemKey())) {
      return item[this.itemKey()];
    }

    return item.toString();
  }
}
