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

  // function rowCells(row: Element): Element[] {
  //   return Array.from(row.querySelectorAll(".datatable-body-cell-label"));
  // }

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
