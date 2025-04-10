import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CheckboxComponent } from "./checkbox.component";

@NgModule({
    imports: [CommonModule, CheckboxComponent],
    exports: [CheckboxComponent],
})
export class CheckboxModule {}
