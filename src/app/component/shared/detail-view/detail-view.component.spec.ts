import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AbstractModel } from "src/app/models/AbstractModel";
import { DetailViewComponent } from "./detail-view.component";
import { RenderViewComponent } from "./view/view.component";

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

  function getLabels() {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dt");
  }

  function getAnswers() {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dl");
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailViewComponent, RenderViewComponent],
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
    it("should handle missing details", () => {
      fixture.detectChanges();
      expect(getLabels().length).toBe(0);
    });

    it("should handle empty details", () => {
      component.fields = [];
      fixture.detectChanges();
      expect(getLabels().length).toBe(0);
    });

    describe("single list detail", () => {
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

      it("should handle single detail", () => {
        expect(getLabels().length).toBe(1);
      });

      it("should handle single answer", () => {
        expect(getAnswers().length).toBe(1);
      });

      it("should create label", () => {
        const labels = getLabels();
        expect(labels[0].innerText.trim()).toBe("custom label");
      });

      it("should create answer", () => {
        const answers = getAnswers();
        expect(answers[0].innerText.trim()).toBe("0");
      });
    });

    describe("multiple list details", () => {
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

      it("should handle multiple labels", () => {
        expect(getLabels().length).toBe(3);
      });

      it("should handle multiple answers", () => {
        expect(getAnswers().length).toBe(3);
      });

      it("should create labels", () => {
        const labels = getLabels();
        expect(labels[0].innerText.trim()).toBe("custom label 0");
        expect(labels[1].innerText.trim()).toBe("custom label 1");
        expect(labels[2].innerText.trim()).toBe("custom label 2");
      });

      it("should create answers", () => {
        const answers = getAnswers();
        expect(answers[0].innerText.trim()).toBe("5");
        expect(answers[1].innerText.trim()).toBe("10");
        expect(answers[2].innerText.trim()).toBe('{"test":"value"}');
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

    it("should inline question and answer on small screen", () => {
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

    it("should expand question and answer on smallest screen", () => {
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

    it("should right align label on small screen", () => {
      viewport.set("small");

      const label = getLabels()[0];
      const labelStyle = window.getComputedStyle(label);

      expect(labelStyle.textAlign).toBe("right");
    });

    it("should left align label on smallest screen", () => {
      viewport.set("extra-small");

      const label = getLabels()[0];
      const labelStyle = window.getComputedStyle(label);

      expect(labelStyle.textAlign).toBe("left");
    });
  });
});
