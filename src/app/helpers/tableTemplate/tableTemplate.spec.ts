import { Component } from "@angular/core";
import { ListTemplate } from "./tableTemplate";

describe("TableTemplate", () => {
  function createClass(
    rows: any[],
    filterMatch: (val: string, row: any) => boolean
  ) {
    @Component({
      selector: "app-test-component",
      template: `
        <ngx-datatable
          #table
          [class]="tableClass"
          [rows]="rows"
          [columns]="columns"
          [rowHeight]="'auto'"
          [headerHeight]="headerHeight"
          [footerHeight]="footerHeight"
        >
        </ngx-datatable>
      `
    })
    class MockListTemplate extends ListTemplate<any> {
      constructor() {
        super(filterMatch);
      }

      protected createRows() {
        this.rows = rows;
      }
    }

    return new MockListTemplate();
  }

  it("should create", () => {
    const mockClass = createClass([], () => true);

    expect(mockClass).toBeTruthy();
  });
});
