import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnInit,
  viewChild,
} from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { Observable } from "rxjs";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

interface CanPredicate {
  watcher: Observable<unknown>;
  predicate: () => boolean;
}

// TODO: we might be able to add capability checking here
// e.g. <baw-can [capability]="canDownloadCapability">
//
/**
 * A component to conditionally disable content if the user does not have a
 * condition or capability met.
 *
 * @example
 * ```html
 * <baw-can if-logged-in>
 *  <button>Click me</button>
 * </baw-can>
 * ```
 */
@Component({
  selector: "baw-can",
  template: `
    <span
      #contentWrapper
      [ngbTooltip]="session.isLoggedIn ? null : 'You must be logged in'"
    >
      <ng-content></ng-content>
    </span>
  `,
  imports: [NgbTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IfLoggedInComponent implements OnInit, AfterViewInit {
  public constructor(
    public session: BawSessionService,
    public elementRef: ElementRef
  ) {}

  public ifLoggedIn = input<boolean>();

  private contentWrapper = viewChild<ElementRef<HTMLSpanElement>>("contentWrapper");

  private predicates: CanPredicate[] = [];

  public ngOnInit(): void {
    if (this.ifLoggedIn) {
      this.predicates.push(this.ifLoggedInPredicate());
    }
  }

  public ngAfterViewInit(): void {
    for (const predicate of this.predicates) {
      predicate.watcher
        // eslint-disable-next-line rxjs-angular/prefer-takeuntil
        .subscribe(() => this.updateState());
    }
  }

  public updateState(): void {
    const shouldDisable = this.predicates.some((predicate) => !predicate.predicate());
    this.disableInteractiveContent(shouldDisable);
  }

  private disableInteractiveContent(state: boolean): void {
    // TODO: use a ContentChild decorator here
    const content = this.contentWrapper().nativeElement.children;

    for (const element of content) {
      if (state) {
        element.setAttribute("disabled", "true");
      } else {
        element.removeAttribute("disabled");
      }
    }
  }

  private ifLoggedInPredicate(): CanPredicate {
    return {
      watcher: this.session.authTrigger,
      predicate: () => this.session.isLoggedIn,
    };
  }
}
