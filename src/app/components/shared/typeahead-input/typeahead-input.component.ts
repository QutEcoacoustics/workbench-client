import { Component, ElementRef, Input, Output, ViewChild } from "@angular/core";
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
})
export class TypeaheadInputComponent {
  public constructor() {}

  @Input() public options: string[]; // to remove

  @Input() public label = "";
  @Input() public inputPlaceholder = "";
  @Input() public multipleInputs = false;
  /** Since models are usually passed to the typeahead input, there needs to be a way to use a property as a human readable value
   * The formatter callback takes a model and specifies what human readable description the models should be displayed as
   */
  @Input() public formatter: (item: unknown) => string;
  /** The options callback is typically linked to a service as it should return a list observable of options that the user could select */
  @Input() public optionsCallback!: (text: string) => Observable<unknown[]>;

  /**
   * When the user adds or removes an item from the active items array, a BehaviorSubject event should fire
   * If this BehaviorSubject is from another component, we can make the external component listen to this event
   */
  @Output() public modelChange: BehaviorSubject<unknown[]> =
    new BehaviorSubject([]);

  @ViewChild("typeaheadInputRef")
  public typeaheadInput: ElementRef<HTMLInputElement>;
  public activeItems: unknown[] = [];
  public inputModel: string;

  public findOptions: OperatorFunction<string, readonly unknown[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(defaultDebounceTime),
      distinctUntilChanged(),
      switchMap((term: string) =>
        this.optionsCallback(term).pipe(
          debounceTime(defaultDebounceTime),
          distinctUntilChanged(),
          map((items: unknown[]) =>
            items
              .filter((item) => this.formatter(item).toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
          )
        )
      )
    );

  public onItemSelected($event: NgbTypeaheadSelectItemEvent<unknown>) {
    $event.preventDefault();

    const selectedItem = $event.item;
    this.activeItems.push(selectedItem);
    this.modelChange.next(this.activeItems);

    this.typeaheadInput.nativeElement.value = "";
    this.inputModel = "";
  }

  public removeLastItem() {
    if (this.multipleInputs && this.inputModel === "" && this.activeItems.length > 0) {
      this.activeItems.pop();
    }
  }

  public removeItem(item: unknown) {
    this.activeItems = this.activeItems.filter((i: unknown) => i !== item);
    this.modelChange.next(this.activeItems);
  }
}
