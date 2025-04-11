import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { IconsModule } from "@shared/icons/icons.module";
import { ItemComponent } from "./item/item.component";
import { ItemsComponent } from "./items/items.component";
import { SelectableItemsComponent } from "./selectable-items/selectable-items.component";

/**
 * Items Module
 */
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IconsModule,
    NgbTooltipModule,
    ItemsComponent,
    ItemComponent,
    SelectableItemsComponent,
  ],
  exports: [ItemsComponent, ItemComponent, SelectableItemsComponent],
})
export class ItemsModule {}
