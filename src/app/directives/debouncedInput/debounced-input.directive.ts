import { Directive, HostListener, OnInit, output } from "@angular/core";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

@Directive({ selector: "input[bawDebouncedInput]" })
export class DebouncedInputDirective extends withUnsubscribe() implements OnInit {
  public filter = output<string>();

  private input$ = new Subject<string>();

  public ngOnInit() {
    this.input$
      .pipe(
        debounceTime(defaultDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe)
      )
      .subscribe((input) => this.filter.emit(input));
  }

  @HostListener("keydown", ["$event"])
  protected onKeydown(event: KeyboardEvent) {
    if (!(event.target instanceof HTMLInputElement)) {
      console.warn("bawDebouncedInput must be attached to an input element");
      return;
    }

    this.input$.next(event.target.value);
  }
}
