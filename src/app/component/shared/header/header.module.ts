import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import {
  FaIconLibrary,
  FontAwesomeModule,
} from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { fontAwesomeLibraries } from "src/app/app.helper";
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
    FontAwesomeModule,
    AuthenticatedImageModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {
  constructor(library: FaIconLibrary) {
    fontAwesomeLibraries(library);
  }
}
