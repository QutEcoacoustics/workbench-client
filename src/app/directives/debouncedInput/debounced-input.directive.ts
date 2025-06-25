import { Directive, HostListener, OnInit, output } from "@angular/core";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

@Directive({ selector: "[bawDebouncedInput]" })
export class DebouncedInputDirective
  extends withUnsubscribe()
  implements OnInit
{
  public valueChange = output<string>();
  private input$ = new Subject<string>();

  public ngOnInit() {
    this.input$
      .pipe(
        debounceTime(defaultDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe),
      )
      .subscribe((input) => this.valueChange.emit(input));
  }

  // We use the "input" event so that we can bind to non-text inputs such as
  // type="range" inputs.
  // Additionally, we use "input" instead of "change" because some user agents
  // will only trigger the "change" event when the input loses focus.
  @HostListener("input", ["$event"])
  protected onKeydown(event: KeyboardEvent) {
    const target = event.target;
    if (typeof event !== "object" || !("value" in target)) {
      console.warn("bawDebouncedInput must attach to an element with 'value'");
      return;
    }

    // The value might be invocable if the element's value is a signal
    const value =
      typeof target.value === "function" ? target.value() : target.value;

    this.input$.next(value);
  }
}
