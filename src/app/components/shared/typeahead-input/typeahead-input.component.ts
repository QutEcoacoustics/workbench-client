import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  NgbTypeaheadModule,
  NgbTypeaheadSelectItemEvent,
} from "@ng-bootstrap/ng-bootstrap";
import { ResultTemplateContext } from "@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  switchMap,
} from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

export type TypeaheadSearchCallback<T> = (
  text: string,
  activeItems: T[]
) => Observable<T[]>;

// This is a standalone component because it needs to be imported in both the
// custom inputs module and the shared module.
// In older angular versions, we would have create a module for this component
// that only contains this component and import it in both the custom inputs
// module and the shared module.
// However, making this component standalone allows us to use it in both modules
// without creating a separate ngModule for it.
//
// HN (2025): This is the first time that we have used standalone components in
// this way, so if it proves to be a maintenance burden, feel free to revert it
@Component({
  selector: "baw-typeahead-input",
  templateUrl: "typeahead-input.component.html",
  styleUrl: "typeahead-input.component.scss",
  standalone: true,
  imports: [
    CommonModule,
    NgbTypeaheadModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
})
export class TypeaheadInputComponent<T = unknown> {
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
  @Input() public resultTemplate: TemplateRef<ResultTemplateContext>;
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

  @Input() public formControl = new FormControl<string | null>(null);
  @Input() public formlyAttributes: any = {};

  /**
   * An event emitter when a user adds, removes, or selects and item from the
   * typeahead input
   */
  @Output() public valueChange = new EventEmitter<T[]>();

  // If multiple items are enabled, they will be added to the value
  // if multiple inputs are disabled, the value will always be an array with
  // a single element.
  // We use the variable name "value" so the component can be used in ngForms
  // and can bind to [(ngModel)].
  public value: T[] = [];

  public findOptions = (text$: Observable<string>): Observable<T[]> => {
    const maximumResults = 10;

    return text$.pipe(
      debounceTime(defaultDebounceTime),
      distinctUntilChanged(),
      switchMap((term: string) =>
        this.searchCallback ? this.searchCallback(term, this.value) : []
      ),
      map((items: T[]) => items.slice(0, maximumResults))
    );
  };

  public templateFormatter = (item: T): string => item.toString();

  public onItemSelected($event: NgbTypeaheadSelectItemEvent<T>): void {
    $event.preventDefault();
    const selectedItem = $event.item;

    if (this.multipleInputs) {
      this.value.push(selectedItem);
      this.valueChange.emit(this.value);

      this.formControl.setValue(null);
    } else {
      this.formControl.setValue(selectedItem.toString());
      this.valueChange.emit([selectedItem]);
    }
  }

  public removeLastItem(): void {
    if (
      this.multipleInputs &&
      this.value.length > 0 &&
      !this.formControl.value
    ) {
      this.value.pop();
      this.valueChange.emit(this.value);
    }
  }

  public removeItem(indexToRemove: number): void {
    // if the "value" array has a length of 1, the splice function doesn't return an empty array
    // therefore, we use length === 1 as an edge case
    if (this.value.length === 1) {
      this.value = [];
    } else {
      this.value.splice(indexToRemove, 1);
      this.valueChange.emit(this.value);
    }
  }
}
