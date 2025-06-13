import { Directive, HostListener, NgZone, OnInit, output } from "@angular/core";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

@Directive({ selector: "input[bawDebouncedInput]" })
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

  @HostListener("keyup", ["$event"])
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
