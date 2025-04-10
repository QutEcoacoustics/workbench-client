import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { defaultDebounceTime } from "src/app/app.helper";

@Component({
  selector: "baw-debounce-input",
  template: `
    <div class="input-group mb-3">
      @if (label) {
        <div class="input-group-prepend input-group-text">
          {{ label }}
        </div>
      }
      <input
        type="text"
        class="form-control"
        [value]="default ?? ''"
        [placeholder]="placeholder"
        (keyup)="onFilter($event)"
      />
    </div>
  `,
  standalone: false
})
export class DebounceInputComponent
  extends withUnsubscribe()
  implements OnInit
{
  @Input() public label: string;
  @Input() public placeholder = "";
  @Input() public default = "";
  @Output() public filter = new EventEmitter<string>();

  private input$ = new Subject<string>();

  public ngOnInit() {
    this.input$
      .pipe(
        debounceTime(defaultDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe)
      )
      .subscribe((input) => this.filter.next(input));
  }

  public onFilter(event: KeyboardEvent) {
    this.input$.next((event.target as HTMLInputElement).value);
  }
}
