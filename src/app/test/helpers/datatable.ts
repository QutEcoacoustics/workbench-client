import { ApiFilter } from "@baw-api/api-common";
import { AbstractModel } from "@models/AbstractModel";
import { SpyObject } from "@ngneat/spectator";

type SetupFunction<Service> = () => {
  root: () => Element;
  service: SpyObject<Service>;
  columns: string[];
  rows: { [key: string]: string }[];
};

export function assertDatatable<
  Service extends ApiFilter<Model, unknown[]>,
  // we use "infer" here so that the default model type can be derived from the
  // service
  Model extends AbstractModel = Service extends ApiFilter<infer M, unknown[]>
    ? M
    : never
>(setup: SetupFunction<Service>): void {
  function tableHeadings(rootElement: Element): Element[] {
    return Array.from(
      rootElement.querySelectorAll(".datatable-header-cell-template-wrap")
    );
  }

  function tableRows(rootElement: Element): Element[] {
    return Array.from(rootElement.querySelectorAll(".datatable-row-group"));
  }

  function rowCells(row: Element): Element[] {
    return Array.from(row.querySelectorAll(".datatable-body-cell-label"));
  }

  function filterApi(service: Service): any {
    return service.filter;
  }

  it("should make one correct api request on load", () => {
    const { service } = setup();
    const filterService = filterApi(service);

    if (!filterService.calls) {
      fail("Service does not have a filter spy");
    } else if (filterService.calls.count() !== 1) {
      fail("Service filter spy was not called once on load");
      return;
    }

    expect(filterService.calls.mostRecent().args[0]).toEqual(
      jasmine.objectContaining({
        paging: { page: 1 },
      })
    );
  });

  it("should have the correct column headings", () => {
    const { columns, root } = setup();
    const rootElement = root();

    const headings = tableHeadings(rootElement);
    expect(headings.length).toBe(columns.length);

    for (const i in columns) {
      const expectedHeading = columns[i];
      const realizedHeading = headings[i];

      expect(realizedHeading).toHaveExactTrimmedText(expectedHeading);
    }
  });

  it("should have the correct row values", () => {
    const { rows, root } = setup();
    const rootElement = root();

    const realizedRows = tableRows(rootElement);
    expect(realizedRows.length).toBe(rows.length);

    for (const i in rows) {
      const expectedRow = rows[i];
      const realizedRow = realizedRows[i];

      const cells = rowCells(realizedRow);
      expect(cells.length).toBe(Object.keys(expectedRow).length);

      for (const key in expectedRow) {
        const expectedValue = expectedRow[key];
        const realizedValue = cells.find((cell) =>
          cell.textContent?.includes(expectedValue)
        );

        expect(realizedValue).toHaveExactTrimmedText(expectedValue);
      }
    }
  });
}
