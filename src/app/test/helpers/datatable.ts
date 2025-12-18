import { By } from "@angular/platform-browser";
import { Spectator, SpectatorDirective } from "@ngneat/spectator";

// these are all callbacks because sometimes the datatable content/column names
// are dependent on the state of the tested component
type SetupFunction = () => {
  root: () => Element;
  columns: () => string[];
  rows: () => { [key: string]: string }[];
};

export function assertDatatable(setup: SetupFunction): void {
  function tableHeadings(rootElement: Element): Element[] {
    return Array.from(
      rootElement.querySelectorAll(".datatable-header-cell-template-wrap")
    );
  }

  function tableRows(rootElement: Element): Element[] {
    return Array.from(rootElement.querySelectorAll("datatable-row-wrapper"));
  }

  it("should have the correct column headings", () => {
    const { columns, root } = setup();
    const rootElement = root();
    const expectedColumns = columns();

    const headings = tableHeadings(rootElement);
    expect(headings.length).toBe(expectedColumns.length);

    for (const i in expectedColumns) {
      const expectedHeading = expectedColumns[i];
      const realizedHeading = headings[i];

      expect(realizedHeading).toHaveExactTrimmedText(expectedHeading);
    }
  });

  it("should have the correct row values", () => {
    const { rows, root } = setup();
    const rootElement = root();
    const expectedRows = rows();

    const realizedRows = tableRows(rootElement);
    expect(realizedRows.length).toBe(expectedRows.length);
  });
}

export function assertDatatableRow(row: HTMLDivElement, expectedValues: string[]) {
  const cells = Array.from(
    row.querySelectorAll("datatable-body-cell"),
  );

  for (const i in expectedValues) {
    const expectedValue = expectedValues[i];
    const realizedValue = cells[i];

    expect(realizedValue).toHaveExactTrimmedText(expectedValue);
  }
}

export function sortDatatableByColumn(spec: SpectatorDirective<any>, column: number) {
  const headerCells = spec.queryAll<HTMLElement>("datatable-header-cell");
  const targetCell = headerCells[column];

  const sortButton = targetCell.querySelector(".sort-btn");

  spec.click(sortButton);
}

export async function selectDatatablePage(spec: SpectatorDirective<any>, page: number) {
  const pagerComponent = spec.query("datatable-pager");

  const expectedAriaLabel = `page ${page}`;
  const pageListItem = pagerComponent.querySelector<HTMLElement>(
    `[aria-label="${expectedAriaLabel}"]`
  );

  const pageButton = pageListItem.querySelector("[role='button']");

  spec.click(pageButton);
}

export function datatableCells(spec: Spectator<any>): any[] {
  return spec.debugElement
    .queryAll(By.css("datatable-body-cell"))
    .map((element) => element.componentInstance);
}
