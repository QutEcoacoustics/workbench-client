import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckboxComponent } from "./checkbox.component";

describe("CheckboxComponent", () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should be checked", () => {
    component.checked = true;
    fixture.detectChanges();
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
      "input"
    );
    expect(checkbox.checked).toBeTruthy();
  });

  it("should not be checked", () => {
    component.checked = false;
    fixture.detectChanges();
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
      "input"
    );
    expect(checkbox.checked).toBeFalsy();
  });

  it("should be disabled", () => {
    component.disabled = true;
    fixture.detectChanges();
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
      "input"
    );
    expect(checkbox.disabled).toBeTruthy();
  });

  it("should not be disabled", () => {
    component.disabled = false;
    fixture.detectChanges();
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
      "input"
    );
    expect(checkbox.disabled).toBeFalsy();
  });
});
