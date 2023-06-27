import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { AbstractModel } from "@models/AbstractModel";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
  switchMap,
} from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

@Component({
  selector: "baw-typeahead-input[optionsCallback]",
  templateUrl: "typeahead-input.component.html",
  styleUrls: ["typeahead-input.component.scss"],
})
export class TypeaheadInputComponent {
  public constructor() { }

  /** A behavior subject that emits the current models selected/active */
  @Input() public modelChange: BehaviorSubject<AbstractModel[] | string[]> = new BehaviorSubject([]);
  /** The options callback is typically linked to a service as it should return a list observable of options that the user could select */
  @Input() public optionsCallback!: (text: string) => Observable<AbstractModel[] | string[]>;
  /** Describes how to convert an object model into a human readable form for use in the pills and typeahead dropdown */
  @Input() public formatter: (item: AbstractModel) => string = (item: AbstractModel): string => item.toString();
  /** Whether the typeahead input should allow multiple inputs in pill form */
  @Input() public multipleInputs = false;
  /** Text to show above the input field. Usually a one 1-2 word descriptor. */
  @Input() public label = "";
  /** Placeholder text that is shown when the input field is empty.
   * Note: This value is not emitted at any point
   */
  @Input() public inputPlaceholder = "";

  @ViewChild("typeaheadInputRef")
  public typeaheadInput: ElementRef<HTMLInputElement>;
  public inputModel: string;

  /** if multiple items are enabled, they will be added to the activeItems */
  public activeItems: AbstractModel[] = [];
  /** if the user clicks on a pill, it will be the selected item */
  public selectedItem: AbstractModel;

  public findOptions: OperatorFunction<string, readonly unknown[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(defaultDebounceTime),
      distinctUntilChanged(),
      switchMap((term: string) =>
        this.optionsCallback(term).pipe(
          map((items: AbstractModel[]) =>
            items
              .filter(
                (item: AbstractModel) =>
                  !this.activeItems.some(
                    (activeItem: AbstractModel) =>
                      JSON.stringify(activeItem) === JSON.stringify(item)
                  )
              )
              .filter(
                (item: AbstractModel) =>
                  this.formatter(item)
                    .toLowerCase()
                    .indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
          )
        )
      )
    );

  public onItemSelected($event: NgbTypeaheadSelectItemEvent<AbstractModel>) {
    $event.preventDefault();
    const selectedItem = $event.item;

    if (this.multipleInputs) {
      this.activeItems.push(selectedItem);
      this.modelChange.next(this.activeItems);

      this.typeaheadInput.nativeElement.value = "";
      this.inputModel = "";
    } else {
      this.modelChange.next([selectedItem]);
    }
  }

  public removeLastItem() {
    if (
      this.multipleInputs &&
      (this.inputModel === "" || this.inputModel === undefined) &&
      this.activeItems.length > 0
    ) {
      this.activeItems.pop();
    }
  }

  public removeItem(item: AbstractModel) {
    this.activeItems = this.activeItems.filter((i: AbstractModel) => i !== item);
    this.modelChange.next(this.activeItems);
  }
}
