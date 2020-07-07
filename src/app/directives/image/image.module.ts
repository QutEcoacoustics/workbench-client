import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ImageDirective } from "./image.directive";

const directives = [ImageDirective];

@NgModule({
  declarations: directives,
  imports: [CommonModule],
  exports: directives,
})
export class ImageDirectiveModule {}
