import { Location } from "@angular/common";
import { ApiFilter } from "@baw-api/api-common";
import { InnerFilter, Sorting } from "@baw-api/baw-api.service";
import { indicate } from "@helpers/rxjs/indicator";
import { AbstractModel } from "@models/AbstractModel";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { shareReplay, startWith, switchMap } from "rxjs/operators";

export class PagingService<M extends AbstractModel, P extends any[] = []> {
  public models$: Observable<M[]>;
  public loading$ = new Subject<boolean>();
  public totalModels: string;
  private page$ = new Subject<number>();
  private sort$: BehaviorSubject<Sorting<M>>;
  private filter$: BehaviorSubject<InnerFilter<M>>;

  constructor(
    private location: Location,
    private api: ApiFilter<M, P>,
    private params: P,
    private method: keyof ApiFilter<M, P> = "filter",
    initialSort?: Sorting<M>,
    initialFilter?: InnerFilter<M>
  ) {
    this.sort$ = new BehaviorSubject<Sorting<M>>(initialSort);
    // TODO Add defaultDebounceTime to filter$
    this.filter$ = new BehaviorSubject<InnerFilter<M>>(initialFilter);

    this.models$ = combineLatest([this.sort$, this.filter$]).pipe(
      switchMap(([sort, filter]) =>
        this.page$.pipe(
          startWith(1),
          switchMap((page) => this.getPage(page, sort, filter))
        )
      ),
      shareReplay(1)
    );
  }

  public sortBy(sort: Partial<Sorting<M>>): void {
    const lastSort = this.sort$.getValue();
    const nextSort = { ...lastSort, ...sort };
    this.sort$.next(nextSort);
  }

  public filterBy(filter: Partial<InnerFilter<M>>): void {
    const lastFilter = this.filter$.getValue();
    const nextFilter = { ...lastFilter, ...filter };
    this.filter$.next(nextFilter);
  }

  public fetch(page: number): void {
    this.page$.next(page);
  }

  private getPage(
    page: number,
    sort: Sorting<M>,
    filter: InnerFilter<M>
  ): Observable<M[]> {
    return this.api[this.method](
      { paging: { page: page ?? 1 }, sorting: sort, filter },
      ...this.params
    ).pipe(indicate(this.loading$));
  }
}
