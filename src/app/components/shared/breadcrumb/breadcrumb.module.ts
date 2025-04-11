import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DirectivesModule } from "@directives/directives.module";
import { IconsModule } from "@shared/icons/icons.module";
import { BreadcrumbComponent } from "./breadcrumb.component";

@NgModule({
    exports: [BreadcrumbComponent],
    imports: [CommonModule, RouterModule, IconsModule, DirectivesModule, BreadcrumbComponent],
})
export class BreadcrumbModule {}
