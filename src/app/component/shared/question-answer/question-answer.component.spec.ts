import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { QuestionAnswerComponent } from "./question-answer.component";

describe("QuestionAnswerComponent", () => {
  let component: QuestionAnswerComponent;
  let fixture: ComponentFixture<QuestionAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionAnswerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    viewport.reset();
  });

  describe("details", () => {
    it("should handle missing details", () => {});

    it("should handle empty details", () => {});

    it("should handle single detail", () => {});

    it("should handle multiple details", () => {});
  });

  describe("screen size", () => {
    it("should inline question and answer on small screen", () => {
      viewport.set("small");
    });

    it("should expand question and answer on extra small screen", () => {
      viewport.set("extra-small");
    });

    it("should left align screen on smallest screen", () => {
      viewport.set("extra-small");
    });

    it("should right align screen on small screen", () => {
      viewport.set("small");
    });
  });
});
