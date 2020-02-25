import { Component, OnInit } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyModule } from "@ngx-formly/core";
import { formlyRoot } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { FormTouchedGuard, WithFormCheck } from "./form.guard";

describe("FormTouchedGuard", () => {
  let guard: FormTouchedGuard;

  function spyOnWindow(confirmation: boolean) {
    spyOn(window, "confirm").and.returnValue(confirmation);
  }

  function createComponent(touched: boolean) {
    return {
      isFormTouched() {
        return touched;
      }
    };
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [FormTouchedGuard]
    }).compileComponents();
  }));

  beforeEach(() => {
    guard = TestBed.inject(FormTouchedGuard);
  });

  it("should navigate away from route if component has no form", () => {
    spyOnWindow(false);
    const component = {};
    expect(guard.canDeactivate(component)).toBeTrue();
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

describe("WithFormCheck", () => {
  @Component({
    selector: "app-testing",
    template: `
      <div>
        <app-form *ngFor="let schema of schemas" [schema]="schema"></app-form>
      </div>
    `
  })
  class MockComponent extends WithFormCheck() implements OnInit {
    public schemas = [];
    public numForms = 0;

    ngOnInit() {
      for (let i = 0; i < this.numForms; i++) {
        this.schemas.push({
          model: {},
          fields: [
            {
              key: "input",
              type: "input",
              templateOptions: {
                label: "input element",
                required: false
              }
            }
          ]
        });
      }
    }
  }

  function dirtyForm(form: number) {
    const input = fixture.nativeElement.querySelectorAll("input")[form];
    input.value = "dirty";
    input.dispatchEvent(new Event("input"));
    fixture.detectChanges();
  }

  let mockComponent: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, FormlyModule.forRoot(formlyRoot)],
      declarations: [MockComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    mockComponent = fixture.componentInstance;
  }));

  it("should handle class with no forms", () => {
    mockComponent.numForms = 0;
    fixture.detectChanges();
    expect(mockComponent.isFormTouched()).toBeFalse();
  });

  it("should handle untouched form", () => {
    mockComponent.numForms = 1;
    fixture.detectChanges();
    expect(mockComponent.isFormTouched()).toBeFalse();
  });

  it("should handle dirty form", () => {
    mockComponent.numForms = 1;
    fixture.detectChanges();

    dirtyForm(0);

    expect(mockComponent.isFormTouched()).toBeTrue();
  });

  it("should handle multiple untouched forms", () => {
    mockComponent.numForms = 3;
    fixture.detectChanges();
    expect(mockComponent.isFormTouched()).toBeFalse();
  });

  it("should handle multiple mixed touch state forms", () => {
    mockComponent.numForms = 3;
    fixture.detectChanges();

    dirtyForm(1);

    expect(mockComponent.isFormTouched()).toBeTrue();
  });

  it("should handle multiple dirty forms", () => {
    mockComponent.numForms = 3;
    fixture.detectChanges();

    dirtyForm(0);
    dirtyForm(1);
    dirtyForm(2);

    expect(mockComponent.isFormTouched()).toBeTrue();
  });
});
