import { of } from "rxjs";
import { delay } from "rxjs/operators";
import { AbstractModel } from "src/app/models/AbstractModel";
import { Filters, Meta } from "../baw-api.service";

export function listMock<M extends AbstractModel>(
  classBuilder: (index: number) => M
) {
  const models: M[] = [];

  for (let i = 0; i < 25; i++) {
    models.push(classBuilder(i));
  }

  return of(models).pipe(delay(1000));
}

export function filterMock<M extends AbstractModel>(
  filters: Filters,
  classBuilder: (index: number) => M
) {
  const models: M[] = [];
  const meta: Meta = {
    status: 200,
    message: "OK",
    sorting: {
      orderBy: "name",
      direction: "asc"
    },
    paging: {
      page: filters?.paging?.page ? filters.paging.page : 1,
      items: filters?.paging?.items ? filters?.paging?.items : 25,
      total: filters?.paging?.total ? filters?.paging?.total : 100,
      maxPage: 4
    }
  };

  const startIndex = (meta.paging.page - 1) * 25;
  const endIndex = meta.paging.page * 25;
  for (let i = startIndex; i < endIndex; i++) {
    const model = classBuilder(i);
    model.addMetadata(meta);
    models.push(model);
  }

  return of(models).pipe(delay(1000));
}
