import { Component, EventEmitter, Input, Output } from "@angular/core";
import { debounceTime, distinctUntilChanged, map, Observable, OperatorFunction } from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

@Component({
  selector: "baw-typeahead-input",
  templateUrl: "typeahead-input.component.html"
})
export class TypeaheadInputComponent {
  public constructor() {}

  @Input() public label = "";
  @Input() public options: string[] = [];
  @Input() public multipleInputs = false;
  @Output() public modelChange = new EventEmitter<string | string[]>();

  public findOptions: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(defaultDebounceTime),
      distinctUntilChanged(),
      map((term) =>
          this.options
            .map((item) => item)
            .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
            .slice(0, 10)
      )
    );
}
