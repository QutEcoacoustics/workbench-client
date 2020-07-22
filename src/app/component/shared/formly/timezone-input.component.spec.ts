import { SpectatorHost, createHostComponentFactory } from "@ngneat/spectator";
import { FormlyTimezoneInput } from "./timezone-input.component";
import { SharedModule } from "@shared/shared.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormComponent } from "@shared/form/form.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { MockToastrService } from "@test/helpers/toastr";
import { Input, Component } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-test",
  template: `
    <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
  `,
})
class HostComponent {
  @Input() form: FormGroup;
  @Input() fields: FormlyFieldConfig[];
  @Input() model: any;
}

describe("FormlyTimezoneInput", () => {
  let spectator: SpectatorHost<FormlyTimezoneInput>;
  const createHostComponent = createHostComponentFactory({
    component: FormlyTimezoneInput,
    host: HostComponent,
    imports: [SharedModule, HttpClientTestingModule],
    providers: [{ provide: ToastrService, useClass: MockToastrService }],
  });

  it("should create", () => {
    spectator = createHostComponent();
    spectator.setHostInput("");
  });
});
