import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  OperatorFunction,
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
  ) => Observable<object[] | string[]>;
  /** Describes how to convert an object model into a human readable form for use in the pills and typeahead dropdown */
  @Input() public resultTemplate: TemplateRef<any>;
  /** Whether the typeahead input should allow multiple inputs in pill form */
  @Input() public multipleInputs = false;
  /** Text to show above the input field. Usually a one 1-2 word descriptor. */
  @Input() public label = "";
  /** Placeholder text that is shown when the input field is empty.
   * Note: This value is not emitted at any point
   */
  @Input() public inputPlaceholder = "";
  @Input() public inputDisabled = false;
  /** An event emitter when a user adds, removes, or selects and item from the typeahead input */
  @Output() public modelChange = new EventEmitter<object[] | string[]>();

  @ViewChild("typeaheadInputRef") public typeaheadInput: ElementRef;

  public inputModel: string | null = null;

  /** if multiple items are enabled, they will be added to the activeItems */
  public activeItems: object[] = [];

  public findOptions: OperatorFunction<string, readonly unknown[]> = (
    text$: Observable<string>
  ) => {
    const maximumResults = 10;

    return text$.pipe(
      debounceTime(defaultDebounceTime),
      distinctUntilChanged(),
      switchMap((term: string) =>
        this.searchCallback(term, this.activeItems).pipe(
          map((items: object[]) => items.slice(0, maximumResults))
        )
      )
    );
  };

  public onItemSelected($event: NgbTypeaheadSelectItemEvent<object>) {
    $event.preventDefault();
    const selectedItem: object = $event.item;

    if (this.multipleInputs) {
      this.activeItems.push(selectedItem);
      this.modelChange.emit(this.activeItems);

      this.inputModel = null;
    } else {
      this.modelChange.emit([selectedItem]);
    }
  }

  public removeLastItem() {
    if (
      this.multipleInputs &&
      this.activeItems.length > 0 &&
      !this.inputModel
    ) {
      this.activeItems.pop();
      this.modelChange.emit(this.activeItems);
    }
  }

  public removeItem(item: object) {
    const indexToRemove = this.activeItems.indexOf(item);
    if (indexToRemove !== -1) {
      this.activeItems.splice(indexToRemove, 1);
      this.modelChange.emit(this.activeItems);
    }
  }
}
