import { Directive, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiFilter } from "@baw-api/api-common";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import {
  defaultApiPageSize,
  Filters,
  InnerFilter,
} from "@baw-api/baw-api.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { AbstractModel } from "@models/AbstractModel";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { noop, Observable, Subject } from "rxjs";
import { switchMap, takeUntil, tap } from "rxjs/operators";

const queryKey = "query";
const pageKey = "page";

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class PaginationTemplate<M extends AbstractModel>
  extends PageComponent
  implements OnInit {
  /**
   * Observable to wrap api request behavior
   */
  public apiRequest$ = new Subject<{ page: number; filterText: string }>();
  /**
   * Maximum number of elements for current filter
   */
  public collectionSize: number;
  /**
   * Tracks whether to display the pagination buttons
   */
  public displayPagination: boolean;
  /**
   * Tracks whether an error has occurred
   */
  public error: ApiErrorDetails;
  /**
   * Tracks whether an api request is in process
   */
  public loading: boolean;
  /**
   * Tracks the current user filter input
   */
  public filter: string;
  /**
   * Tracks the current filter page
   */
  private _page: number;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    /**
     * Config for pagination defaults
     */
    protected config: NgbPaginationConfig,
    /**
     * API Service which will create filter requests
     */
    protected api: ApiFilter<M, any[]>,
    /**
     * Key to match filter inputs against
     */
    protected filterKey: keyof M,
    /**
     * API Service parameters required to make a filter request
     */
    protected apiParams: () => any[],
    /**
     * Function which will run after each api update (ie. scroll/filter)
     */
    protected apiUpdate: (models: M[]) => void,
    /**
     * Default inner filter values
     */
    protected defaultInnerFilter: () => InnerFilter<M> = () =>
      ({} as InnerFilter<M>)
  ) {
    super();
  }

  public ngOnInit() {
    // Set pagination defaults
    this.config.maxSize = 3;
    this.config.pageSize = defaultApiPageSize;
    this.config.rotate = true;
    this.displayPagination = false;

    this._page = 1;

    this.apiRequest$
      .pipe(
        tap(({ page, filterText }) => {
          this.loading = true;
          this._page = page;
          this.filter = filterText;
          this.updateQueryParams(this.page, this.filter);
        }),
        switchMap(() => this.getModels()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (models: M[]) => {
          this.loading = false;
          this.collectionSize = models?.[0]?.getMetadata()?.paging?.total || 0;
          this.displayPagination = this.collectionSize > defaultApiPageSize;
          this.apiUpdate(models);
        },
        (error: ApiErrorDetails) => {
          console.error("Scroll Template Failure: ", error);
          this.error = error;
          this.loading = false;
        }
      );

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.updateFromUrl(), noop);
  }

  /**
   * Read the previous filter query and page number from the url,
   * and update the page to match
   */
  private updateFromUrl() {
    const params = this.route.snapshot.queryParams;
    this.filter = params[queryKey] ?? "";
    this._page = parseInt(params[pageKey], 10) || 1;
    this.apiRequest$.next({ page: this.page, filterText: this.filter });
  }

  public get page() {
    return this._page;
  }

  /**
   * Handle pagination events
   */
  public set page(page: number) {
    this.apiRequest$.next({ page, filterText: this.filter });
  }

  /**
   * Handle filter events
   */
  public onFilter(filterText: string, page: number = 1) {
    this.apiRequest$.next({ page, filterText });
  }

  /**
   * Update the url query parameters to contain the current page
   * and filter query.
   */
  protected updateQueryParams(page: number, query?: string) {
    const params = {};
    if (page > 1) {
      params[pageKey] = page;
    }
    if (query) {
      params[queryKey] = query;
    }

    this.router.navigate([], { relativeTo: this.route, queryParams: params });
  }

  /**
   * Retrieve the newest batch of models using the latest page and filter
   * options.
   */
  protected getModels(): Observable<M[]> {
    return this.api.filter(this.generateFilter(), ...this.apiParams());
  }

  /**
   * Generate the filter for the api request
   */
  protected generateFilter(): Filters<M> {
    return {
      paging: { page: this.page },
      filter: this.filter
        ? ({
            ...this.defaultInnerFilter(),
            [this.filterKey]: { contains: this.filter },
          } as InnerFilter<M>)
        : this.defaultInnerFilter(),
    };
  }
}
