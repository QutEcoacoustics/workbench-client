import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IconsModule } from "@shared/icons/icons.module";
import { TimeComponent } from "./time/time.component";

const components = [TimeComponent];

@NgModule({
    imports: [CommonModule, IconsModule, FormsModule, ReactiveFormsModule, ...components],
    exports: components,
})
export class InputModule {}
