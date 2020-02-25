import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HeaderDropdownComponent } from "./header-dropdown/header-dropdown.component";
import { HeaderItemComponent } from "./header-item/header-item.component";
import { HeaderComponent } from "./header.component";

@NgModule({
  declarations: [HeaderComponent, HeaderItemComponent, HeaderDropdownComponent],
  imports: [CommonModule, RouterModule, NgbModule],
  exports: [HeaderComponent]
})
export class HeaderModule {}
