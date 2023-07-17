import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { ResultTemplateContext } from "@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  switchMap,
} from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

@Component({
  selector: "baw-typeahead-input",
  templateUrl: "typeahead-input.component.html",
  styleUrls: ["typeahead-input.component.scss"],
})
export class TypeaheadInputComponent {
  public constructor() {}

  /**
   * The options callback is typically linked to a service as it should return a list observable of options that the user could select
   * Active items are included in the callback as the api request should have a filter condition to filter these results out
   */
  @Input() public searchCallback: (
    text: string,
    activeItems: object[]
  ) => Observable<object[]>;
  /** Describes how to convert an object model into a human readable form for use in the pills and typeahead dropdown */
  @Input() public resultTemplate: TemplateRef<ResultTemplateContext>;
  /** Whether the typeahead input should allow multiple inputs in pill form */
  @Input() public multipleInputs = true;
  /** Text to show above the input field. Usually a one 1-2 word description. */
  @Input() public label = "";
  /** Placeholder text that is shown when the input field is empty.
   * Note: This value is not emitted at any point
   */
  @Input() public inputPlaceholder = "";
  @Input() public inputDisabled = false;
  /** An event emitter when a user adds, removes, or selects and item from the typeahead input */
  @Output() public modelChange = new EventEmitter<object[]>();

  // if multiple items are enabled, they will be added to the value
  // if multiple inputs are disabled, the value will always be an array with a single element
  // we use the variable name "value" so the component can be used in ngForms and can bind to [(ngModel)]
  public value: object[] = [];
  protected inputModel!: string | null;

  public findOptions = (
    text$: Observable<string>
  ): Observable<object[]> => {
    const maximumResults = 10;

    return text$.pipe(
      debounceTime(defaultDebounceTime),
      distinctUntilChanged(),
      switchMap((term: string) => this.searchCallback(term, this.value)),
      map((items: object[]) => items.slice(0, maximumResults))
    );
  };

  public onItemSelected($event: NgbTypeaheadSelectItemEvent<object>): void {
    $event.preventDefault();
    const selectedItem: object = $event.item;

    if (this.multipleInputs) {
      this.value.push(selectedItem);
      this.modelChange.emit(this.value);

      this.inputModel = null;
    } else {
      this.modelChange.emit([selectedItem]);
    }
  }

  public removeLastItem(): void {
    if (
      this.multipleInputs &&
      this.value.length > 0 &&
      !this.inputModel
    ) {
      this.value.pop();
      this.modelChange.emit(this.value);
    }
  }

  public removeItem(item: object): void {
    // using indexOf means that JavaScript doesn't have to search through the entire array to remove the item
    // and will only search until that item is found
    const indexToRemove = this.value.indexOf(item);

    if (indexToRemove !== -1) {
      this.value.splice(indexToRemove, 1);
      this.modelChange.emit(this.value);
    }
  }
}
