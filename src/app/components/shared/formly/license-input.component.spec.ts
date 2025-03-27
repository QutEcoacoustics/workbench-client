import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { formlyConfig } from "./custom-inputs.module";
import { LicenseInputComponent } from "./license-input.component";

describe("LicenseInputComponent", () => {
  let spec: Spectator<LicenseInputComponent>;

  const createComponent = createComponentFactory({
    component: LicenseInputComponent,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      FormlyModule.forRoot(formlyConfig),
      FormlyBootstrapModule,
    ],
  });

  function setup(): void {
    spec = createComponent();
    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(LicenseInputComponent);
  });
});
