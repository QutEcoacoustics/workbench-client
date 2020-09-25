import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { noop, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { defaultDebounceTime } from "src/app/app.helper";

@Component({
  selector: "baw-debounce-input",
  template: `
    <div class="input-group mb-3">
      <div *ngIf="label" class="input-group-prepend">
        <span class="input-group-text">{{ label }}</span>
      </div>
      <input
        type="text"
        class="form-control"
        [value]="default ? default : ''"
        [placeholder]="placeholder"
        (keyup)="onFilter($event)"
      />
    </div>
  `,
})
export class DebounceInputComponent implements OnInit {
  @Input() public label: string;
  @Input() public placeholder = "";
  @Input() public default = "";
  @Output() public filter = new EventEmitter<string>();

  private input$ = new Subject<string>();

  public ngOnInit() {
    this.input$
      .pipe(debounceTime(defaultDebounceTime), distinctUntilChanged())
      .subscribe((input) => this.filter.next(input), noop);
  }

  public onFilter(event: KeyboardEvent) {
    this.input$.next((event.target as HTMLInputElement).value);
  }
}
