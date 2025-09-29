import { Directive, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiFilter } from "@baw-api/api-common";
import {
  defaultApiPageSize,
  Filters,
  InnerFilter,
  Sorting,
} from "@baw-api/baw-api.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { PageComponent } from "@helpers/page/pageComponent";
import { AbstractModel } from "@models/AbstractModel";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subject } from "rxjs";
import { switchMap, takeUntil, tap } from "rxjs/operators";

const queryKey = "query";
const pageKey = "page";

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class PaginationTemplate<M extends AbstractModel>
  extends PageComponent
  implements OnInit
{
  /**
   * Observable to wrap api request behavior
   */
  public apiRequest$ = new Subject<{ page: number; filterText: string }>();
  /**
   * Maximum number of elements for current filter
   */
  public collectionSize: number;
  // TODO: this condition seems to be an artifact of an underlying bug
  // we should find why we have to use this condition with ngb-pagination and
  // fix the root cause of the bug
  /**
   * Tracks whether to display the pagination buttons
   * if you do not place the paginations inside an if condition using this value
   * all query string parameters (such as page=2) will be removed when the page
   * first loads
   */
  public displayPagination: boolean;
  /**
   * Tracks whether an error has occurred
   */
  public error: BawApiError;
  /**
   * Tracks whether an api request is in process
   */
  public loading: boolean;
  /**
   * Tracks the current user filter input
   */
  public filter: string;
  /**
    * A configuraiton property that can be used to overwrite how many
    * items are fetched in a page of results
    */
  public pageSize?: number;
  /**
   * Tracks the current filter page
   */
  private _page: number;

  public constructor(
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
      ({} as InnerFilter<M>),
    protected defaultSortingFilter?: () => Sorting<keyof M>,
  ) {
    super();
  }

  public ngOnInit() {
    // Set pagination defaults
    // TODO: this is overwriting the global NgbPagination config every time
    // a component that uses this paginationTemplate is created
    this.config.maxSize = 3;
    this.config.pageSize = this.pageSize ?? defaultApiPageSize;
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
      .subscribe({
        next: (models: M[]) => {
          this.loading = false;
          this.collectionSize = models?.[0]?.getMetadata()?.paging?.total || 0;
          this.displayPagination = this.collectionSize > defaultApiPageSize;
          this.apiUpdate(models);
        },
        error: (error: BawApiError) => {
          this.error = error;
          this.loading = false;
        },
      });

    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.updateFromUrl());
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

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge",
    });
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
    // if the template has an explicit page size set, we should add the number
    // of items to the request body
    // if the user has not set an explicit page size, we want to use the default
    // returned by the api
    const pageItemFilters = this.pageSize ? { items: this.pageSize } : {};

    const filters: Filters<M> = {
      paging: {
        page: this.page,
        ...pageItemFilters,
      },
      filter: this.filter
        ? ({
            ...this.defaultInnerFilter(),
            [this.filterKey]: { contains: this.filter },
          } as InnerFilter<M>)
        : this.defaultInnerFilter(),
    };

    if (this.defaultSortingFilter) {
      filters.sorting = this.defaultSortingFilter();
    }

    return filters;
  }
}
