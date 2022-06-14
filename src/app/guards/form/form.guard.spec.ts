import { Component, OnInit, QueryList } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BawSessionService } from "@baw-api/baw-session.service";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { FormComponent, SchemaConfig } from "@shared/form/form.component";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import {
  FormCheckingComponent,
  FormTouchedGuard,
  withFormCheck,
} from "./form.guard";

describe("FormTouchedGuard", () => {
  let guard: FormTouchedGuard;

  function spyOnWindow(confirmation: boolean) {
    spyOn(window, "confirm").and.returnValue(confirmation);
  }

  function createComponent(touched: boolean): FormCheckingComponent {
    return {
      appForms: new QueryList<FormComponent>(),
      isFormTouched: () => touched,
      resetForms() {},
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [FormTouchedGuard, BawSessionService],
    }).compileComponents();

    guard = TestBed.inject(FormTouchedGuard);
  });

  it("should navigate away from route if component has no form", () => {
    spyOnWindow(false);
    const component = {};
    expect(guard.canDeactivate(component as any)).toBeTrue();
  });

  it("should navigate away from route if form is untouched", () => {
    spyOnWindow(false);
    const component = createComponent(false);
    expect(guard.canDeactivate(component)).toBeTrue();
  });

  it("should create window confirmation on dirty form", () => {
    spyOnWindow(false);
    const component = createComponent(true);
    guard.canDeactivate(component);
    expect(confirm).toHaveBeenCalled();
  });

  it("should not navigate away from route if window confirmation is denied", () => {
    spyOnWindow(false);
    const component = createComponent(true);
    expect(guard.canDeactivate(component)).toBeFalse();
  });

  it("should navigate away from route if window confirmation is accepted", () => {
    spyOnWindow(true);
    const component = createComponent(true);
    expect(guard.canDeactivate(component)).toBeTrue();
  });
});

@Component({
  selector: "baw-testing",
  template: `
    <baw-form
      *ngFor="let schema of schemas"
      [model]="schema.model"
      [fields]="schema.fields"
    ></baw-form>
  `,
})
class MockComponent extends withFormCheck() implements OnInit {
  public schemas = [];
  public numForms = 0;

  public ngOnInit(): void {
    for (let i = 0; i < this.numForms; i++) {
      this.schemas.push({ model: {}, fields: [this.createField()] });
    }
  }

  private createField(): SchemaConfig {
    return {
      key: "input",
      type: "input",
      templateOptions: { label: "input element", required: false },
    };
  }
}

describe("WithFormCheck", () => {
  let spec: Spectator<MockComponent>;
  const createComponent = createComponentFactory({
    component: MockComponent,
    imports: [SharedModule],
    providers: [BawSessionService],
    mocks: [ToastrService],
  });

  function dirtyForm(form: number) {
    const input = spec.queryAll("input")[form];
    spec.typeInElement("dirty", input);
    spec.detectChanges();
  }

  function setNumForms(num: number) {
    spec.component.numForms = num;
    spec.detectChanges();
  }

  function assertFormTouched(wasTouched: boolean) {
    expect(spec.component.isFormTouched()).toEqual(wasTouched);
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
  });

  it("should handle class with no forms", () => {
    setNumForms(0);
    assertFormTouched(false);
  });

  it("should handle untouched form", () => {
    setNumForms(1);
    assertFormTouched(false);
  });

  it("should handle dirty form", () => {
    setNumForms(1);
    dirtyForm(0);
    assertFormTouched(true);
  });

  it("should handle multiple untouched forms", () => {
    setNumForms(3);
    assertFormTouched(false);
  });

  it("should handle multiple mixed touch state forms", () => {
    setNumForms(3);
    dirtyForm(1);
    assertFormTouched(true);
  });

  it("should handle multiple dirty forms", () => {
    setNumForms(3);
    dirtyForm(0);
    dirtyForm(1);
    dirtyForm(2);
    assertFormTouched(true);
  });
});
