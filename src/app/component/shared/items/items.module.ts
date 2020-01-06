import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fontAwesomeLibraries } from "src/app/app.helper";
import { ItemComponent } from "./item/item.component";
import { ItemsComponent } from "./items/items.component";

@NgModule({
  declarations: [ItemsComponent, ItemComponent],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  exports: [ItemsComponent, ItemComponent]
})
export class ItemsModule {
  constructor() {
    fontAwesomeLibraries(library);
  }
}
