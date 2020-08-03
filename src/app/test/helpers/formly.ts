import { FormlyFieldConfig } from "@ngx-formly/core";

/**
 * Test form fields match expected outputs
 * @param formInputs Fields to test
 */
export function testFormlyFields(formInputs: FormlyFieldTestSuite[]) {
  formInputs.forEach(
    ({
      testGroup,
      setup = () => {},
      field,
      key,
      type,
      required = false,
      label,
      inputType,
      description,
    }) => {
      describe(testGroup, () => {
        beforeEach(() => {
          setup();
        });

        it("should contain input", () => {
          expect(field).toBeTruthy();
        });

        it(`should have "${key}" key`, () => {
          expect(field.key).toBe(key);
        });

        it(`should ${required ? "not " : ""}be required`, () => {
          expect(field.templateOptions?.required ?? false).toBe(required);
        });

        if (type) {
          it(`should use formly ${type}`, () => {
            expect(field.type).toBe(type);
          });
        }

        if (label) {
          it("should have label", () => {
            expect(field.templateOptions.label).toBe(label);
          });
        }

        if (inputType) {
          it(`should be input of type "${inputType}"`, () => {
            expect(field.templateOptions.type).toBe(inputType);
          });
        }

        if (description) {
          it("should contain description", () => {
            expect(field.templateOptions.description).toBe(description);
          });
        }
      });
    }
  );
}

export interface FormlyFieldTestSuite {
  /** Test suite name */
  testGroup: string;
  /** Initial setup before test */
  setup?: () => void;
  /** Field to test */
  field: FormlyFieldConfig;
  /** Key field should use */
  key: string;
  /** Is field required */
  required?: boolean;
  /** Field input method (ie. textarea, input) */
  type?: string;
  /** Field label */
  label?: string;
  /** Field input type (ie. text, password) */
  inputType?: string;
  /** Field description */
  description?: string;
}
