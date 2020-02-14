import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  FaIconLibrary,
  FontAwesomeModule
} from "@fortawesome/angular-fontawesome";
import { fontAwesomeLibraries } from "src/app/app.helper";
import { ItemComponent } from "./item/item.component";
import { ItemsComponent } from "./items/items.component";
import { SelectableItemsComponent } from "./selectable-items/selectable-items.component";

@NgModule({
  declarations: [ItemsComponent, ItemComponent, SelectableItemsComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  exports: [ItemsComponent, ItemComponent, SelectableItemsComponent]
})
export class ItemsModule {
  constructor(library: FaIconLibrary) {
    fontAwesomeLibraries(library);
  }
}
