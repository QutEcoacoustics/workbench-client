import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "@directives/directives.module";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { PipesModule } from "@pipes/pipes.module";
import { IconsModule } from "@shared/icons/icons.module";
import { UserLinkComponent } from "./user-link.component";

@NgModule({
  declarations: [UserLinkComponent],
  imports: [
    CommonModule,
    IconsModule,
    NgbTooltipModule,
    PipesModule,
    DirectivesModule,
  ],
  exports: [UserLinkComponent],
})
export class UserLinkModule {}
