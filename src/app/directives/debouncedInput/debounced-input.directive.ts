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
    if (
      !(event.target instanceof HTMLInputElement) &&
      !(event.target instanceof HTMLTextAreaElement)
    ) {
      console.warn("bawDebouncedInput must be attached to an input element");
      return;
    }

    this.input$.next(event.target.value);
  }
}
