import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AnswerComponent } from "./answer/answer.component";
import { QuestionAnswerComponent } from "./question-answer.component";

describe("QuestionAnswerComponent", () => {
  let component: QuestionAnswerComponent;
  let fixture: ComponentFixture<QuestionAnswerComponent>;

  function getColumns() {
    return fixture.nativeElement.querySelectorAll("div.row div");
  }

  function getLabels() {
    return fixture.nativeElement.querySelectorAll("strong");
  }

  function getAnswers() {
    return fixture.nativeElement.querySelectorAll("app-answer");
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionAnswerComponent, AnswerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerComponent);
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
      component.details = [];
      fixture.detectChanges();
      expect(getLabels().length).toBe(0);
    });

    describe("single list detail", () => {
      beforeEach(() => {
        component.details = [
          {
            label: "custom label",
            value: 0
          }
        ];
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
        component.details = [
          {
            label: "custom label 0",
            value: 5
          },
          {
            label: "custom label 1",
            value: "10"
          },
          {
            label: "custom label 2",
            value: { test: "value" }
          }
        ];
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
      component.details = [
        {
          label: "custom label",
          value: 0
        }
      ];
      fixture.detectChanges();
    });

    it("should inline question and answer on small screen", () => {
      viewport.set("small");

      const columns = getColumns();
      const parent = window.getComputedStyle(columns[0].parentElement);
      const leftColumn = window.getComputedStyle(columns[0]);
      const rightColumn = window.getComputedStyle(columns[1]);

      expect(parent.display).toBe("flex");
      expect(parent.flexDirection).toBe("row");
      expect(leftColumn.flexBasis).toBe("25%");
      expect(rightColumn.flexBasis).toBe("75%");
    });

    it("should expand question and answer on smallest screen", () => {
      viewport.set("extra-small");

      const columns = getColumns();
      const parent = window.getComputedStyle(columns[0].parentElement);
      const leftColumn = window.getComputedStyle(columns[0]);
      const rightColumn = window.getComputedStyle(columns[1]);

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
