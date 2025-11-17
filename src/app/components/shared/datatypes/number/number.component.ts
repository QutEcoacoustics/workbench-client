import { DecimalPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { isInstantiatedPipe } from "@pipes/is-instantiated/is-instantiated.pipe";

// TODO: Should we attempt to convert strings to numbers here?
/**
 * @description
 * A component that can display numeric variables in the users local format.
 *
 * If the datatype is not a number, it will display an incorrect data type
 * error message.
 * Because this component also handles undefined and null checking, it shows a
 * consistent "No Value" message when the value is missing.
 * If used consistently, this component will ensure that all numbers, missing
 * values and incorrect datatypes are displayed consistently across the
 * application.
 *
 * This component does not attempt to convert strings to numbers. If the value
 * is not a number, it will display an incorrect data type error message.
 * This design decision ensures type safety and prevents unexpected behavior
 * from implicit type coercion.
 *
 * This is useful for when you have untrusted data that may not be the correct
 * type and you want the error messages to be consistent across the application.
 *
 * @example
 * ```ts
 * <baw-safe-number [value]="someValue" />
 * ```
 *
 * This component adheres to the "inline-block" display style, meaning it can be
 * substituted directly into text without disrupting the flow.
 */
@Component({
  selector: "baw-safe-number",
  templateUrl: "./number.component.html",
  imports: [isInstantiatedPipe, DecimalPipe, NgbTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SafeNumberComponent {
  public readonly value = input.required<unknown>();
  public readonly missingValueText = input("(missing)");
  public readonly incorrectTypeText = input("Type Error");
}
