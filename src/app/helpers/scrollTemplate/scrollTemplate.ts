import { Directive, OnInit } from "@angular/core";
import { ApiFilter } from "@baw-api/api-common";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { InnerFilter, Subsets } from "@baw-api/baw-api.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { AbstractModel } from "@models/AbstractModel";
import { noop, Observable, Subject } from "rxjs";
import { map, mergeMap, takeUntil } from "rxjs/operators";

/**
 * Scroll Template Class
 * Handles creating all the generic logic required for an infinite scrolling
 * component which retrieves "pages" seamlessly from the API.
 */
@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class ScrollTemplate<I, M extends AbstractModel>
  extends PageComponent
  implements OnInit {
  /**
   * Observable which updates scroll elements
   */
  public apiRequest$ = new Subject<void>();
  /**
   * Tracks whether the infinite scrolling has been disabled
   */
  public disableScroll: boolean;
  /**
   * Tracks whether an error has occurred
   */
  public error: ApiErrorDetails;
  /**
   * Tracks whether an api request is in process
   */
  public loading: boolean;
  /**
   * Tracks additional filter constraints
   */
  private filter: InnerFilter<I>;
  /**
   * Tracks the current filter page
   */
  private page: number;

  constructor(
    /**
     * API Service which will create filter requests
     */
    private api: ApiFilter<M, any>,
    /**
     * Key to match filter inputs against
     */
    private filterKey: keyof I,
    /**
     * API Service parameters required to make a filter request
     */
    private apiParams: () => any[],
    /**
     * Function which will run after each api update (ie. scroll/filter)
     */
    private apiUpdate: (models: M[], hasResetPage: boolean) => void,
    /**
     * Default filter values, may be overridden by later requests
     */
    private defaultFilter: InnerFilter<I> = {}
  ) {
    super();
  }

  public ngOnInit() {
    this.page = 1;
    this.loading = true;
    this.apiRequest$
      .pipe(
        mergeMap(() => this.getModels()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(noop, (error: ApiErrorDetails) => {
        console.error("Scroll Template Failure: ", error);
        this.error = error;
        this.loading = false;
      });
    this.apiRequest$.next();
  }

  /**
   * Handle scroll events, this should be attached to the scrolling
   * container similar to the following:
   * ```
   * <div infiniteScroll (scrolled)="onScroll">
   * </div>
   * ```
   */
  public onScroll() {
    this.page++;
    this.loading = true;
    this.apiRequest$.next();
  }

  /**
   * Handle filter events, this should be attached to the debounce input
   * element similar to the following:
   * ```
   * <baw-debounce-input (filter)="onFilter($event)">
   * </baw-debounce-input>
   * ```
   */
  public onFilter(input: string) {
    this.page = 1;
    this.loading = true;
    this.filter = input
      ? ({ [this.filterKey]: { contains: input } } as {
          [P in keyof I]?: Subsets;
        })
      : undefined;
    this.apiRequest$.next();
  }

  /**
   * Retrieve the newest batch of models using the latest page and filter
   * options. This will make a callback to the apiUpdate construction value
   * once the models have been retrieved.
   */
  protected getModels(): Observable<void> {
    return this.api
      .filter(
        {
          ...this.defaultFilter,
          paging: { page: this.page },
          filter: this.filter,
        },
        ...this.apiParams()
      )
      .pipe(
        map((models: M[]) => {
          this.loading = false;
          this.disableScroll = this.isScrollDisabled(models);
          this.apiUpdate(models, this.page === 1);
        }),
        takeUntil(this.unsubscribe)
      );
  }

  /**
   * Determine if the scroll container should be disabled
   * @param models Models
   */
  protected isScrollDisabled(models: M[]) {
    return (
      models.length === 0 ||
      models[0].getMetadata().paging.maxPage === this.page
    );
  }
}
