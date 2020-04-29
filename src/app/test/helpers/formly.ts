/**
 * Test a formly field
 * @param field Input to test
 * @param key Input ID/Key
 * @param htmlType Input type (input, textarea, select)
 * @param required Input required
 * @param label Input label
 * @param type Input type (text, number, password)
 * @param description Input description
 */
export function testFormlyField(
  testGroup: string,
  setup: () => void = () => {},
  field: any,
  key: string,
  htmlType: string,
  required: boolean,
  label?: string,
  type?: string,
  description?: string
) {
  describe(testGroup, () => {
    beforeEach(() => {
      setup();
    });

    it("should contain input", () => {
      expect(field).toBeTruthy();
    });

    it(`should be ${htmlType} input`, () => {
      expect(field.type).toBe(htmlType);
    });

    it(`should contain have "${key}" key`, () => {
      expect(field.key).toBe(key);
    });

    it(`should ${required ? "not " : ""}be required`, () => {
      expect(field.templateOptions.required).toBe(required);
    });

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

export function testFormlyFields(
  formInputs: {
    testGroup: string;
    setup: () => void;
    field: any;
    key: string;
    htmlType: string;
    required: boolean;
    label?: string;
    type?: string;
    description?: string;
  }[]
) {
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
      testFormlyField(
        testGroup,
        setup,
        field,
        key,
        htmlType,
        required,
        label,
        type,
        description
      );
    }
  );
}
