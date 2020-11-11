import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IconsModule } from "@shared/icons/icons.module";
import { HeaderDropdownComponent } from "./header-dropdown/header-dropdown.component";
import { HeaderItemComponent } from "./header-item/header-item.component";
import { HeaderComponent } from "./header.component";

/**
 * Header Module
 */
@NgModule({
  declarations: [HeaderComponent, HeaderItemComponent, HeaderDropdownComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    AuthenticatedImageModule,
    IconsModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
