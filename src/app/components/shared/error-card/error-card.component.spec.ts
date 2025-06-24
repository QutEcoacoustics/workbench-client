import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { BawErrorData } from "@interfaces/apiInterfaces";
import { ErrorCardComponent } from "./error-card.component";

interface ErrorCardTest {
  name: string;
  errors: BawErrorData[];
  expected: string[];
}

describe("ErrorCardComponent", () => {
  let spec: Spectator<ErrorCardComponent>;

  const createComponent = createComponentFactory({
    component: ErrorCardComponent,
  });

  const errorCards = () => spec.queryAll(".error-output");

  function setup(errors: BawErrorData[]) {
    spec = createComponent({ detectChanges: false });

    spec.setInput("errors", errors);
    spec.detectChanges();
  }

  function generateErrorMessage(property: string, errors: string[]) {
    return {
      [property]: errors,
    };
  }

  function assertErrorCards(expected: string[]) {
    expect(errorCards()).toHaveLength(expected.length);

    const foundErrorCards = errorCards();
    for (const i in expected) {
      expect(foundErrorCards[i]).toHaveExactTrimmedText(expected[i]);
    }
  }

  it("should create", () => {
    setup([]);
    expect(spec.component).toBeInstanceOf(ErrorCardComponent);
  });

  const tests = [
    {
      name: "should render no errors correctly",
      errors: [],
      expected: [],
    },
    {
      name: "should render one error correctly",
      errors: [generateErrorMessage("property", ["error"])],
      expected: ["property: error"],
    },
    {
      name: "should render multiple errors about one property correctly",
      errors: [
        generateErrorMessage("property", ["1", "2"]),
      ],
      expected: ["property: 1,2"],
    },
    {
      name: "should render multiple errors correctly",
      errors: [
        generateErrorMessage("property", ["1"]),
        generateErrorMessage("second property", ["2"]),
      ],
      expected: ["property: 1", "second property: 2"],
    },
    {
      name: "should render multiple errors with multiple properties correctly",
      errors: [
        generateErrorMessage("property", ["1"]),
        generateErrorMessage("second property", ["2", "3"]),
      ],
      expected: ["property: 1", "second property: 2,3"],
    }
  ] satisfies ErrorCardTest[];

  for (const test of tests) {
    it(test.name, () => {
      setup(test.errors);
      assertErrorCards(test.expected);
    });
  }
});
