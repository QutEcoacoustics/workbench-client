import { FormlyFieldConfig } from "@ngx-formly/core";

/**
 * Test form fields match expected outputs
 * @param formInputs Fields to test
 */
export function testFormlyFields(formInputs: FormlyFieldTestSuite[]) {
  formInputs.forEach(
    ({
      testGroup,
      setup,
      field,
      key,
      htmlType,
      required,
      label,
      type,
      description,
    }) => {
      describe(testGroup, () => {
        beforeEach(() => {
          if (setup) {
            setup();
          }
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

        if (htmlType) {
          it(`should be ${htmlType} input`, () => {
            expect(field.type).toBe(htmlType);
          });
        }

        if (label) {
          it("should have label", () => {
            expect(field.templateOptions.label).toBe(label);
          });
        }

        if (type) {
          it(`should be of type "${type}"`, () => {
            expect(field.templateOptions.type).toBe(type);
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
  htmlType?: string;
  /** Field label */
  label?: string;
  /** Field input type (ie. text, password) */
  type?: string;
  /** Field description */
  description?: string;
}
