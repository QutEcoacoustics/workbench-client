type SetupFunction = () => {
  root: () => Element;
  columns: string[];
  rows: { [key: string]: string }[];
};

export function assertDatatable(setup: SetupFunction): void {
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
