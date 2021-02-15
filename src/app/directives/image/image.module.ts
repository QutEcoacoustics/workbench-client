import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AuthenticatedImageDirective } from "./image.directive";

const directives = [AuthenticatedImageDirective];

//TODO This doesn't need to be a module, just import DirectivesModule
@NgModule({
  declarations: directives,
  imports: [CommonModule],
  exports: directives,
})
export class AuthenticatedImageModule {}
