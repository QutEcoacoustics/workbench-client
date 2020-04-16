import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AbstractModel } from "src/app/models/AbstractModel";
import { DetailViewComponent } from "./detail-view.component";
import { RenderFieldComponent } from "./render-field/render-field.component";

class MockModel extends AbstractModel {
  constructor(opts: any) {
    super(opts);
  }

  public redirectPath(...args: any): string {
    throw new Error("Method not implemented.");
  }
  public toJSON(): object {
    throw new Error("Method not implemented.");
  }
}

describe("DetailViewComponent", () => {
  let component: DetailViewComponent;
  let fixture: ComponentFixture<DetailViewComponent>;

  function getWrapper() {
    return (fixture.nativeElement as HTMLElement).querySelector("div");
  }

  function getFields() {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dt");
  }

  function getValues() {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dl");
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailViewComponent, RenderFieldComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    viewport.reset();
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("details", () => {
    it("should handle missing fields", () => {
      fixture.detectChanges();
      expect(getFields().length).toBe(0);
    });

    it("should handle empty fields", () => {
      component.fields = [];
      fixture.detectChanges();
      expect(getFields().length).toBe(0);
    });

    describe("single field", () => {
      beforeEach(() => {
        component.fields = [
          {
            key: "id",
            templateOptions: {
              label: "custom label",
            },
          },
        ];
        component.model = new MockModel({ id: 0 });
        fixture.detectChanges();
      });

      it("should handle single field", () => {
        expect(getFields().length).toBe(1);
      });

      it("should handle single value", () => {
        expect(getValues().length).toBe(1);
      });

      it("should create field", () => {
        const fields = getFields();
        expect(fields[0].innerText.trim()).toBe("custom label");
      });

      it("should create value", () => {
        const values = getValues();
        expect(values[0].innerText.trim()).toBe("0");
      });
    });

    describe("multiple fields", () => {
      beforeEach(() => {
        component.fields = [
          {
            key: "id",
            templateOptions: {
              label: "custom label 0",
            },
          },
          {
            key: "string",
            templateOptions: {
              label: "custom label 1",
            },
          },
          {
            key: "object",
            templateOptions: {
              label: "custom label 2",
            },
          },
        ];
        component.model = new MockModel({
          id: 5,
          string: "10",
          object: { test: "value" },
        });
        fixture.detectChanges();
      });

      it("should handle multiple fields", () => {
        expect(getFields().length).toBe(3);
      });

      it("should handle multiple values", () => {
        expect(getValues().length).toBe(3);
      });

      it("should create fields", () => {
        const fields = getFields();
        expect(fields[0].innerText.trim()).toBe("custom label 0");
        expect(fields[1].innerText.trim()).toBe("custom label 1");
        expect(fields[2].innerText.trim()).toBe("custom label 2");
      });

      it("should create values", () => {
        const values = getValues();
        expect(values[0].innerText.trim()).toBe("5");
        expect(values[1].innerText.trim()).toBe("10");
        expect(values[2].innerText.trim()).toBe('{"test":"value"}');
      });
    });
  });

  describe("screen size", () => {
    beforeEach(() => {
      component.fields = [
        {
          key: "id",
          templateOptions: {
            label: "custom label",
          },
        },
      ];
      component.model = new MockModel({ id: 0 });
      fixture.detectChanges();
    });

    it("should inline field and value on small screen", () => {
      viewport.set("small");

      const parentEl = getWrapper();
      const parent = window.getComputedStyle(parentEl);
      const leftColumn = window.getComputedStyle(parentEl.firstElementChild);
      const rightColumn = window.getComputedStyle(parentEl.lastElementChild);

      expect(parent.display).toBe("flex");
      expect(parent.flexDirection).toBe("row");
      expect(leftColumn.flexBasis).toBe("25%");
      expect(rightColumn.flexBasis).toBe("75%");
    });

    it("should expand field and value on smallest screen", () => {
      viewport.set("extra-small");

      const parentEl = getWrapper();
      const parent = window.getComputedStyle(parentEl);
      const leftColumn = window.getComputedStyle(parentEl.firstElementChild);
      const rightColumn = window.getComputedStyle(parentEl.lastElementChild);

      expect(parent.display).toBe("flex");
      expect(parent.flexDirection).toBe("row");
      expect(leftColumn.flexBasis).toBe("auto");
      expect(rightColumn.flexBasis).toBe("auto");
    });

    it("should right align field on small screen", () => {
      viewport.set("small");

      const field = getFields()[0];
      const fieldStyle = window.getComputedStyle(field);

      expect(fieldStyle.textAlign).toBe("right");
    });

    it("should left align field on smallest screen", () => {
      viewport.set("extra-small");

      const field = getFields()[0];
      const fieldStyle = window.getComputedStyle(field);

      expect(fieldStyle.textAlign).toBe("left");
    });
  });
});
