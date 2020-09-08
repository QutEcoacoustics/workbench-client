import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { noop, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "baw-filter",
  template: `
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text">{{ label }}</span>
      </div>
      <input
        type="text"
        class="form-control"
        [placeholder]="placeholder"
        (keyup)="onFilter($event)"
      />
    </div>
  `,
})
export class FilterComponent implements OnInit {
  @Input() public label = "Filter";
  @Input() public placeholder = "";
  @Output() public filter = new EventEmitter<string>();

  private input$ = new Subject<string>();

  public ngOnInit() {
    this.input$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((input) => this.filter.next(input), noop);
  }

  public onFilter(event: KeyboardEvent) {
    this.input$.next((event.target as HTMLInputElement).value);
  }
}
