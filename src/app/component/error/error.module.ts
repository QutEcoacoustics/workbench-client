import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { PageNotFoundComponent } from "./page-not-found.component";
import { ResolverHandlerComponent } from "./resolver-handler.component";

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: "**",
        component: PageNotFoundComponent
      }
    ])
  ],
  declarations: [PageNotFoundComponent, ResolverHandlerComponent],
  exports: [PageNotFoundComponent, RouterModule, ResolverHandlerComponent]
})
export class ErrorModule {}
