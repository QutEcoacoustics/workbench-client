import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-date",
  templateUrl: "./date.component.html",
  styleUrls: ["./date.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true,
    },
  ],
})
export class DateComponent implements ControlValueAccessor {
  @Input() public label: string;

  public value: Date;
  public date: NgbDate;
  public formattedDate: string;

  public maxDate: NgbDateStruct;
  public minDate: NgbDateStruct;

  public constructor(
    private formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar
  ) {
    this.maxDate = this.calendar.getToday();
    this.minDate = { year: 1970, month: 1, day: 1 };
  }

  /**
   * Invoked when the model has been changed
   */
  public onChange: (_: any) => void = (_: any) => {};

  /**
   * Invoked when the model has been touched
   */
  public onTouched: () => void = () => {};

  /**
   * Method that is invoked on an update of a model.
   */
  public updateChanges(): void {
    this.onChange(this.value);
  }

  /**
   * Writes a new item to the element.
   *
   * @param value the value
   */
  public writeValue(value: string): void {
    this.setDate(this.validateInput(this.date, value));
    this.updateChanges();
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   *
   * @param fn
   */
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   *
   * @param fn
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public validateInput(
    currentValue: NgbDate | null,
    input: string | null
  ): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  public objectToDate(date: NgbDate | null): Date {
    return !date ? undefined : new Date(date.year, date.month - 1, date.day);
  }

  public formatDate(date: NgbDate): string {
    return this.formatter.format(date);
  }

  public setDate(date: NgbDate): void {
    this.date = date;
    this.value = this.objectToDate(date);
    this.formattedDate = this.formatDate(date);
    this.updateChanges();
  }
}
