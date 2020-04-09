import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckboxComponent } from "./checkbox.component";

describe("CheckboxComponent", () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    viewport.reset();
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should be centered", () => {
    viewport.set("large");

    component.isCentered = true;
    fixture.detectChanges();

    const checkbox: HTMLDivElement = fixture.nativeElement.querySelector("div");
    const computedStyles = window.getComputedStyle(checkbox);
    expect(computedStyles.marginLeft).toBe("579px");
    expect(computedStyles.marginRight).toBe("579px");
  });

  it("should not be centered", () => {
    viewport.set("large");

    component.isCentered = false;
    fixture.detectChanges();

    const checkbox: HTMLDivElement = fixture.nativeElement.querySelector("div");
    const computedStyles = window.getComputedStyle(checkbox);
    expect(computedStyles.marginLeft).toBe("0px");
    expect(computedStyles.marginRight).toBe("0px");
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
