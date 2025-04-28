import { AbstractModel } from "@models/AbstractModel";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { id, IdOr } from "../api-common";
import { defaultApiPageSize, Filters, Meta } from "../baw-api.service";

const delayPeriod = 1000;

export function listMock<M extends AbstractModel>(
  classBuilder: (index: number) => M
): Observable<M[]> {
  const models: M[] = [];

  for (let i = 0; i < defaultApiPageSize; i++) {
    models.push(classBuilder(i));
  }

  return of(models).pipe(delay(delayPeriod));
}

export function filterMock<M extends AbstractModel>(
  filters: Filters<M>,
  classBuilder: (index: number) => M
): Observable<M[]> {
  const models: M[] = [];
  const meta: Meta<any> = {
    status: 200,
    message: "OK",
    filter: filters.filter,
    sorting: filters.sorting
      ? filters.sorting
      : {
          orderBy: "name",
          direction: "asc",
        },
    paging: {
      page: filters?.paging?.page ? filters.paging.page : 1,
      items: filters?.paging?.items
        ? filters?.paging?.items
        : defaultApiPageSize,
      total: filters?.paging?.total ? filters?.paging?.total : 100,
      maxPage: 4,
    },
  };

  const startIndex = (meta.paging.page - 1) * defaultApiPageSize;
  const endIndex = meta.paging.page * defaultApiPageSize;

  for (let i = startIndex; i < endIndex; i++) {
    const model = classBuilder(i);
    model.addMetadata(meta);
    models.push(model);
  }

  return of(models).pipe(delay(delayPeriod));
}

export function showMock<M extends AbstractModel>(
  model: IdOr<M>,
  classBuilder: (modelId: number) => M
): Observable<M> {
  return of(classBuilder(parseInt(id<M>(model), 10))).pipe(delay(delayPeriod));
}
