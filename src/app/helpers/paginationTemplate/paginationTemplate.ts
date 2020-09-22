import { Directive, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ApiFilter } from "@baw-api/api-common";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import {
  defaultApiPageSize,
  InnerFilter,
  Subsets,
} from "@baw-api/baw-api.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { AbstractModel } from "@models/AbstractModel";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { noop, Observable, Subject } from "rxjs";
import { filter, map, mergeMap, takeUntil } from "rxjs/operators";

const queryKey = "query";
const pageKey = "page";

@Directive()
// tslint:disable-next-line: directive-class-suffix
export abstract class PaginationTemplate<I, M extends AbstractModel>
  extends PageComponent
  implements OnInit {
  /**
   * Observable which updates scroll elements
   */
  public apiRequest$ = new Subject<void>();
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
   * Tracks additional filter constraints
   */
  public filter: string;
  /**
   * Maximum number of elements for current filter
   */
  public collectionSize: number;
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
    private filterKey: keyof I,
    /**
     * API Service parameters required to make a filter request
     */
    private apiParams: () => any[],
    /**
     * Function which will run after each api update (ie. scroll/filter)
     */
    private apiUpdate: (models: M[]) => void,
    /**
     * Default filter values, may be overridden by later requests
     */
    private defaultFilter: InnerFilter<I> = {}
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
        mergeMap(() => this.getModels()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(noop, (error: ApiErrorDetails) => {
        console.error("Scroll Template Failure: ", error);
        this.error = error;
        this.loading = false;
      });

    this.updateFromUrl();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribe)
      )
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
    this.onFilter(this.filter, this._page);
  }

  public get page() {
    return this._page;
  }

  /**
   * Handle pagination events
   */
  public set page(page: number) {
    this._page = page;
    this.loading = true;
    this.apiRequest$.next();
    this.updateQueryParams(this._page, this.filter);
  }

  /**
   * Handle filter events
   */
  public onFilter(input: string, page: number = 1) {
    this._page = page;
    this.filter = input;
    this.loading = true;
    this.apiRequest$.next();
    this.updateQueryParams(this._page, input);
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

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  /**
   * Retrieve the newest batch of models using the latest page and filter
   * options. This will make a callback to the apiUpdate construction value
   * once the models have been retrieved.
   */
  protected getModels(): Observable<void> {
    const innerFilter = {
      [this.filterKey]: { contains: this.filter },
    } as { [P in keyof I]?: Subsets };

    return this.api
      .filter(
        {
          ...this.defaultFilter,
          paging: { page: this._page },
          filter: this.filter ? (innerFilter as any) : undefined,
        },
        ...this.apiParams()
      )
      .pipe(
        map((models: M[]) => {
          this.loading = false;
          this.collectionSize = models?.[0]?.getMetadata()?.paging?.total || 0;
          this.displayPagination = this.collectionSize <= defaultApiPageSize;
          this.apiUpdate(models);
        }),
        takeUntil(this.unsubscribe)
      );
  }
}
