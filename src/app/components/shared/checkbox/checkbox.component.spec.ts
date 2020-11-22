import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckboxComponent } from "./checkbox.component";

describe("CheckboxComponent", () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
    }).compileComponents();

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
    const marginLeft = parseInt(computedStyles.marginLeft.substr(0, 3), 10);
    const marginRight = parseInt(computedStyles.marginRight.substr(0, 3), 10);

    expect(marginLeft).toBeGreaterThan(500);
    expect(marginRight).toBeGreaterThan(500);
    expect(marginLeft === marginRight).toBeTrue();
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
