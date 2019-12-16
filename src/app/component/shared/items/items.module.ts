import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ItemComponent } from "./item/item.component";
import { ItemsComponent } from "./items/items.component";

@NgModule({
  declarations: [ItemsComponent, ItemComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  exports: [ItemsComponent]
})
export class ItemsModule {
  constructor() {
    library.add(fas);
  }
}
