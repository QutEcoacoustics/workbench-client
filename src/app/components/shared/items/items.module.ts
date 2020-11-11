import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IconsModule } from "@shared/icons/icons.module";
import { ItemComponent } from "./item/item.component";
import { ItemsComponent } from "./items/items.component";
import { SelectableItemsComponent } from "./selectable-items/selectable-items.component";

/**
 * Items Module
 */
@NgModule({
  declarations: [ItemsComponent, ItemComponent, SelectableItemsComponent],
  imports: [CommonModule, RouterModule, IconsModule],
  exports: [ItemsComponent, ItemComponent, SelectableItemsComponent],
})
export class ItemsModule {}
