import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ItemsItemComponent } from "./item/item.component";
import { ItemsComponent } from "./items/items.component";

@NgModule({
  declarations: [ItemsComponent, ItemsItemComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  exports: [ItemsComponent, ItemsItemComponent]
})
export class ItemsModule {
  constructor() {
    library.add(fas);
  }
}
