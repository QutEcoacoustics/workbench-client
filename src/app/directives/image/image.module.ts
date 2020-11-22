import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AuthenticatedImageDirective } from "./image.directive";

const directives = [AuthenticatedImageDirective];

@NgModule({
  declarations: directives,
  imports: [CommonModule],
  exports: directives,
})
export class AuthenticatedImageModule {}
