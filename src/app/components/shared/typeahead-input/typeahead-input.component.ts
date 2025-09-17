import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  NgbTypeaheadSelectItemEvent,
  NgbTypeahead,
} from "@ng-bootstrap/ng-bootstrap";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
} from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgTemplateOutlet } from "@angular/common";
import { FormsModule } from "@angular/forms";

export type TypeaheadSearchCallback<T> = (
  text: string,
  activeItems: T[],
) => Observable<T[]>;

@Component({
  selector: "baw-typeahead-input",
  templateUrl: "./typeahead-input.component.html",
  styleUrl: "./typeahead-input.component.scss",
  imports: [FaIconComponent, NgTemplateOutlet, NgbTypeahead, FormsModule],
})
export class TypeaheadInputComponent<T = unknown> implements OnChanges {
  /**
   * The options callback is typically linked to a service as it should return
   * a list observable of options that the user could select Active items are
   * included in the callback as the api request should have a filter condition
   * to filter these results out.
   */
  @Input() public searchCallback: TypeaheadSearchCallback<T>;
  /**
   * Describes how to convert an object model into a human readable form for
   * use in the pills and typeahead dropdown.
   */
  @Input() public resultTemplate: NgbTypeahead["resultTemplate"];
  /** Whether the typeahead input should allow multiple inputs in pill form */
  @Input() public multipleInputs = true;
  /** Text to show above the input field. Usually a one 1-2 word description. */
  @Input() public label = "";
  /**
   * Placeholder text that is shown when the input field is empty.
   * Note: This value is not emitted at any point
   */
  @Input() public inputPlaceholder = "";
  @Input() public inputDisabled = false;
  @Input() public queryOnFocus = true;

  // if multiple items are enabled, they will be added to the value
  // if multiple inputs are disabled, the value will always be an array with a single element
  // we use the variable name "value" so the component can be used in ngForms and can bind to [(ngModel)]
  @Input() public value: T[] = [];
  /** An event emitter when a user adds, removes, or selects and item from the typeahead input */
  @Output() public modelChange = new EventEmitter<T[]>();

  public inputModel: string | null;
  protected focus$ = new Subject<T[]>();

  public ngOnChanges(change: SimpleChanges): void {
    // If we are not creating a multiple input typeahead, changing the [value]
    // property should directly change the value inside the typeahead input.
    // This is also useful for populating the typeahead with a default value.
    if (!this.multipleInputs && Object.prototype.hasOwnProperty.call(change, "value")) {
      const value = this.value[0]?.toString();
      this.inputModel = value;
    }
  }

  protected findOptions = (text$: Observable<string>): Observable<T[]> => {
    const maximumResults = 10;

    return merge(this.focus$, text$).pipe(
      debounceTime(defaultDebounceTime),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (!this.searchCallback) {
          return [];
        }

        if (term === "" || term === null) {
          if (this.queryOnFocus) {
            return this.searchCallback("", this.value);
          }

          return [];
        }

        return this.searchCallback(term, this.value);
      }),
      map((items: T[]) => items.slice(0, maximumResults)),
    );
  };

  protected templateFormatter = (item: T): string => item.toString();

  protected onItemSelected(event: NgbTypeaheadSelectItemEvent<T>): void {
    event.preventDefault();
    const selectedItem = event.item;

    if (this.multipleInputs) {
      this.value.push(selectedItem);
      this.modelChange.emit(this.value);

      this.inputModel = null;
    } else {
      this.value = [selectedItem];
      this.modelChange.emit([selectedItem]);

      this.inputModel = selectedItem.toString();
    }
  }

  protected removeLastItem(): void {
    if (this.multipleInputs && this.value.length > 0 && !this.inputModel) {
      this.value.pop();
      this.modelChange.emit(this.value);
    }
  }

  protected removeItem(indexToRemove: number): void {
    // if the "value" array has a length of 1, the splice function doesn't return an empty array
    // therefore, we use length === 1 as an edge case
    if (this.value.length === 1) {
      this.value = [];
    } else {
      this.value.splice(indexToRemove, 1);
    }

    this.modelChange.emit(this.value);
  }

  protected handleInput(): void {
    // When in single input mode, the typeahead acts as autocomplete where items
    // wil be suggested as the user searches, and the input's value will be used
    // as output.
    // Therefore, if the user selects an item, then starts changing the value,
    // we want to undo that selection.
    // To prevent emitting a lot of events, we only emit a change event if there
    // is a value currently selected.
    //
    // TODO: we should add "lose matching" support so that if the user types in
    // the exact value as a search result it should be automatically selected,
    // meaning that the user doesn't have to click on the search result item.
    if (!this.multipleInputs && this.value.length > 0) {
      this.value = [];
      this.modelChange.emit([]);
    }
  }
}
