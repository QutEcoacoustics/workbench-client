import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "@shared/shared.module";
import { TableTemplate } from "./tableTemplate";

@Component({
  selector: "baw-test-component",
  template: `
    <ngx-datatable #table [rows]="rows" [columns]="columns"> </ngx-datatable>
  `,
})
class MockComponent extends TableTemplate<{ id: number | string }> {
  public columns = [{ prop: "id" }];

  constructor() {
    super(() => true);
  }

  protected createRows() {
    this.rows = [];
  }
}

describe("TableTemplate", () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  function createRows(rows: any[]) {
    spyOn(component as any, "createRows").and.callFake(() => {
      component["rows"] = rows;
    });

    component["loadTable"]();
  }

  function checkMatch(filterMatch: (filter: string, cell: any) => boolean) {
    spyOn(
      component as any,
      "filterMatch"
    ).and.callFake((val: string, row: any) => filterMatch(val, row));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("loadTable", () => {
    it("should handle zero rows", () => {
      const rows = [];
      createRows(rows);
      fixture.detectChanges();

      expect(component["rows"]).toEqual([]);
    });

    it("should handle single row", () => {
      const rows = [{ id: "a" }];
      createRows(rows);
      fixture.detectChanges();

      expect(component["rows"]).toEqual([{ id: "a" }]);
    });

    it("should handle multiple rows", () => {
      const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
      createRows(rows);
      fixture.detectChanges();

      expect(component["rows"]).toEqual([
        { id: "a" },
        { id: "b" },
        { id: "c" },
      ]);
    });
  });

  describe("updateFilter", () => {
    it("should handle no rows", () => {
      const rows = [];
      createRows(rows);
      checkMatch((filter, cell) => component["checkMatch"](filter, cell.id));
      fixture.detectChanges();

      component["updateFilter"]({ target: { value: "filter" } });
      fixture.detectChanges();
      expect(component["rows"]).toEqual([]);
    });

    it("should handle no characters", () => {
      const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
      createRows(rows);
      checkMatch((filter, cell) => component["checkMatch"](filter, cell.id));
      fixture.detectChanges();

      component["updateFilter"]({ target: { value: "" } });
      fixture.detectChanges();
      expect(component["rows"]).toEqual([
        { id: "a" },
        { id: "b" },
        { id: "c" },
      ]);
    });

    it("should handle single character", () => {
      const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
      createRows(rows);
      checkMatch((filter, cell) => component["checkMatch"](filter, cell.id));
      fixture.detectChanges();

      component["updateFilter"]({ target: { value: "a" } });
      fixture.detectChanges();
      expect(component["rows"]).toEqual([{ id: "a" }]);
    });

    it("should handle multiple characters", () => {
      const rows = [{ id: "aa" }, { id: "ab" }, { id: "ac" }];
      createRows(rows);
      checkMatch((filter, cell) => component["checkMatch"](filter, cell.id));
      fixture.detectChanges();

      component["updateFilter"]({ target: { value: "ab" } });
      fixture.detectChanges();
      expect(component["rows"]).toEqual([{ id: "ab" }]);
    });

    it("should any substr", () => {
      const rows = [{ id: "ad" }, { id: "ae" }, { id: "af" }];
      createRows(rows);
      checkMatch((filter, cell) => component["checkMatch"](filter, cell.id));
      fixture.detectChanges();

      component["updateFilter"]({ target: { value: "ae" } });
      fixture.detectChanges();
      expect(component["rows"]).toEqual([{ id: "ae" }]);
    });

    it("should handle no matches", () => {
      const rows = [{ id: "aa" }, { id: "ac" }, { id: "ad" }];
      createRows(rows);
      checkMatch((filter, cell) => component["checkMatch"](filter, cell.id));
      fixture.detectChanges();

      component["updateFilter"]({ target: { value: "ab" } });
      fixture.detectChanges();
      expect(component["rows"]).toEqual([]);
    });

    it("should clear filter", () => {
      const rows = [{ id: "aa" }, { id: "ac" }, { id: "ad" }];
      createRows(rows);
      checkMatch((filter, cell) => component["checkMatch"](filter, cell.id));
      fixture.detectChanges();

      component["updateFilter"]({ target: { value: "ab" } });
      fixture.detectChanges();

      component["updateFilter"]({ target: { value: "" } });
      fixture.detectChanges();
      expect(component["rows"]).toEqual([
        { id: "aa" },
        { id: "ac" },
        { id: "ad" },
      ]);
    });
  });

  describe("checkMatch", () => {
    it("should handle empty field", () => {
      const mock = new MockComponent();
      const res = mock["checkMatch"]("", "value");

      expect(res).toBeTruthy();
    });

    it("should handle field", () => {
      const mock = new MockComponent();
      const res = mock["checkMatch"]("val", "value");

      expect(res).toBeTruthy();
    });

    it("should match substring", () => {
      const mock = new MockComponent();
      const res = mock["checkMatch"]("lu", "value");

      expect(res).toBeTruthy();
    });

    it("should fail to match", () => {
      const mock = new MockComponent();
      const res = mock["checkMatch"]("x", "value");

      expect(res).toBeFalsy();
    });

    it("should be case insensitive", () => {
      const mock = new MockComponent();
      const res = mock["checkMatch"]("VALUE", "value");

      expect(res).toBeTruthy();
    });
  });
});
