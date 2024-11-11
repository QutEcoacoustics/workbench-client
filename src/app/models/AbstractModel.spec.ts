import { Injector } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { AbstractModel, getUnknownViewUrl } from "./AbstractModel";
import { bawPersistAttr } from "./AttributeDecorators";
import { AssociationInjector } from "./ImplementsInjector";

export class MockModel extends AbstractModel {
  public kind = "Mock Model";

  public constructor(raw: Record<string, any>, protected injector?: AssociationInjector) {
    super(raw, injector);
  }

  public get viewUrl(): string {
    return getUnknownViewUrl("Mock Model does not have a viewUrl");
  }
}

describe("AbstractModel", () => {
  describe("toJSON", () => {
    const assertToJson = (model: AbstractModel, result: Record<string, any>) =>
      expect(model.getJsonAttributes()).toEqual({
        ...result,
        kind: "Mock Model",
      });
    const assertToJsonWithCreate = (
      model: AbstractModel,
      result: Record<string, any>
    ) => expect(model.getJsonAttributes({ create: true })).toEqual(result);
    const assertToJsonWithUpdate = (
      model: AbstractModel,
      result: Record<string, any>
    ) => expect(model.getJsonAttributes({ update: true })).toEqual(result);

    [
      { type: "undefined", value: undefined, output: undefined },
      { type: "null", value: null, output: null },
      { type: "string", value: "example", output: "example" },
      { type: "empty string", value: "", output: "" },
      { type: "number", value: 42, output: 42 },
      { type: "zero", value: 0, output: 0 },
      { type: "Set", value: new Set([1, 2, 3]), output: [1, 2, 3] },
      // Duration should output in seconds
      { type: "Duration", value: Duration.fromMillis(100000), output: 100 },
      {
        type: "DateTime",
        value: DateTime.fromISO("2019-01-01T00:00:00"),
        output: DateTime.fromISO("2019-01-01T00:00:00").toISO(),
      },
    ].forEach(({ type, value, output }) => {
      it(`should handle ${type} on basic toJSON() request`, () => {
        const model = new MockModel({ id: 1, test: value });
        assertToJson(model, { id: 1, test: output });
        assertToJsonWithCreate(model, {});
        assertToJsonWithUpdate(model, {});
      });

      it(`should handle ${type} on toJSON({create: true}) request`, () => {
        class Model extends MockModel {
          @bawPersistAttr({
            create: true,
            update: false,
            supportedFormats: ["json"],
          })
          public test: any;
        }
        const model = new Model({ id: 1, test: value });
        assertToJson(model, { id: 1, test: output });
        assertToJsonWithCreate(model, { test: output });
        assertToJsonWithUpdate(model, {});
      });

      it(`should handle ${type} on toJSON({update: true}) request`, () => {
        class Model extends MockModel {
          @bawPersistAttr({
            create: false,
            update: true,
            supportedFormats: ["json"],
          })
          public test: any;
        }
        const model = new Model({ id: 1, test: value });
        assertToJson(model, { id: 1, test: output });
        assertToJsonWithCreate(model, {});
        assertToJsonWithUpdate(model, { test: output });
      });
    });

    let defaultData: any;
    beforeEach(() => {
      defaultData = { id: 1, name: "name", set: new Set([1, 2, 3]) };
    });

    it("should filter out injector on basic toJSON() request", () => {
      class MockInjector extends Injector {
        public get(_token: any): any {
          return undefined;
        }
      }
      const mockInjector = new MockInjector() as AssociationInjector ;
      const model = new MockModel(defaultData, mockInjector);
      expect(model["injector"]).toEqual(mockInjector);
      expect<any>(Object.keys(model.getJsonAttributes())).not.toContain(
        "injector"
      );
    });

    it("should handle multiple on basic toJSON() request", () => {
      const model = new MockModel(defaultData);
      assertToJson(model, { id: 1, name: "name", set: [1, 2, 3] });
    });

    it("should handle multiple on toJSON({create: true}) request", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json"] })
        public name: string;
        @bawPersistAttr({ create: true, supportedFormats: ["json"] })
        public set: Set<number>;
      }
      const model = new Model(defaultData);
      assertToJsonWithCreate(model, { name: "name", set: [1, 2, 3] });
    });

    it("should handle multiple on toJSON({update: true}) request", () => {
      class Model extends MockModel {
        @bawPersistAttr({ update: true, supportedFormats: ["json"] })
        public name: string;
        @bawPersistAttr({ update: true, supportedFormats: ["json"] })
        public set: Set<number>;
      }
      const model = new Model(defaultData);
      assertToJsonWithUpdate(model, { name: "name", set: [1, 2, 3] });
    });
  });

  describe("emitting file or null in formdata or json requests", () => {
    const testFile = new File([""], "testFileName.png");

    it("should emit null when serializing a model via JSON and deleting a file", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: null });
      const actual = model.getJsonAttributes({ create: true });
      expect(actual).toEqual(jasmine.objectContaining({
        image: null
      }));
    });

    it("should not emit file type objects in JSON attributes", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: testFile });
      const actual = model.getJsonAttributes({ create: true });
      expect(Object.keys(actual)).not.toContain("image");
    });

    it("should emit file type objects when serializing a model via formData", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: testFile });
      const actual = model.getFormDataOnlyAttributes({ create: true });
      expect(actual.get("mock_model[image]")).toEqual(model.image);
    });

    it("should not emit null values when serializing a model via formData", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: null });
      const actual = model.getFormDataOnlyAttributes({ create: true });
      expect(actual.has("mock_model[image]")).toBeFalse();
      expect(actual.keys()).toHaveSize(0);
    });

    it("toJSON emits values as is (null case)", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: null });
      const actual = model.toJSON();
      expect(actual.image).toBeNull();
    });

    it("toJSON emits values as is (File type object case)", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: testFile });
      const actual = model.toJSON();
      expect(actual.image).toBeInstanceOf(File);
    });

    it("should emit file type objects when serializing a model via formData", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: testFile });
      const actual = model.getFormDataOnlyAttributes({ create: true });
      expect(actual.get("mock_model[image]")).toEqual(model.image);
    });

    it("should not emit null values when serializing a model via formData", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: null });
      const actual = model.getFormDataOnlyAttributes({ create: true });
      expect(actual.has("mock_model[image]")).toBeFalse();
      expect(actual.keys()).toHaveSize(0);
    });

    it("toJSON emits values as is (null case)", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: null });
      const actual = model.toJSON();
      expect(actual.image).toBeNull();
    });

    it("toJSON emits values as is (File type object case)", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["json", "formData"] })
        public image: any;
      }
      const model = new Model({ id: 1, image: testFile });
      const actual = model.toJSON();
      expect(actual.image).toBeInstanceOf(File);
    });
  });

  describe("hasFormData", () => {
    const testFile = new File([""], "testFileName.png");
    [
      { label: "create: true", create: true },
      { label: "update: true", update: true },
    ].forEach((test) => {
      describe(test.label, () => {
        function hasFormDataOnlyAttributes(model: AbstractModel) {
          return model.hasFormDataOnlyAttributes(
            test.create ? { create: true } : { update: true }
          );
        }

        it("should return true if form data exists", () => {
          class Model extends MockModel {
            @bawPersistAttr({ supportedFormats: ["formData"] })
            public value0: any;
          }
          const model = new Model({ value0: "value" });
          expect(hasFormDataOnlyAttributes(model)).toBeTrue();
        });

        it("should handle detecting falsy values", () => {
          class Model extends MockModel {
            @bawPersistAttr({ supportedFormats: ["formData"] })
            public value0: any;
          }
          const model = new Model({ value0: 0 });
          expect(hasFormDataOnlyAttributes(model)).toBeTrue();
        });

        it("should return true if only one attribute is instantiated", () => {
          class Model extends MockModel {
            @bawPersistAttr({ supportedFormats: ["formData"] })
            public value0: any;
            @bawPersistAttr({ supportedFormats: ["formData"] })
            public value1: any;
          }
          const model = new Model({ value0: "value" });
          expect(hasFormDataOnlyAttributes(model)).toBeTrue();
        });

        it("should return false is no attributes are instantiated", () => {
          class Model extends MockModel {
            @bawPersistAttr({ supportedFormats: ["formData"] })
            public value0: any;
            @bawPersistAttr({ supportedFormats: ["formData"] })
            public value1: any;
          }
          const model = new Model({});
          expect(hasFormDataOnlyAttributes(model)).toBeFalse();
        });

        it("should return false if no attributes exist", () => {
          class Model extends MockModel {}
          const model = new Model({});
          expect(hasFormDataOnlyAttributes(model)).toBeFalse();
        });

        it("should not want to send a formdata request if attribute is null", () => {
          class Model extends MockModel {
            @bawPersistAttr({ supportedFormats: ["json", "formData"] })
            public image: any;
          }
          const model = new Model({image: null});
          expect(hasFormDataOnlyAttributes(model)).toBeFalse();
        });

        it("should want to send FormData request if attribute is a File type object", () => {
          class Model extends MockModel {
            @bawPersistAttr({ supportedFormats: ["json", "formData"] })
            public image: any;
          }
          const model = new Model({image: testFile});
          expect(hasFormDataOnlyAttributes(model)).toBeTrue();
        });
      });
    });
  });

  describe("toFormData", () => {
    const assertToFormData = (
      model: AbstractModel,
      result: Record<string, any>
    ) =>
      expect(model.getFormDataOnlyAttributes()).toEqual(createFormData(result));
    const assertToFormDataWithCreate = (
      model: AbstractModel,
      result: Record<string, any>
    ) =>
      expect(model.getFormDataOnlyAttributes({ create: true })).toEqual(
        createFormData(result)
      );
    const assertToFormDataWithUpdate = (
      model: AbstractModel,
      result: Record<string, any>
    ) =>
      expect(model.getFormDataOnlyAttributes({ update: true })).toEqual(
        createFormData(result)
      );
    const createFormData = (obj: Record<string, any>) => {
      const data = new FormData();
      for (const key of Object.keys(obj)) {
        data.append(`MockModel[${key}]`, obj[key]);
      }
      return data;
    };

    [
      { type: "undefined", value: undefined, output: undefined },
      { type: "null", value: null, output: null },
      { type: "string", value: "example", output: "example" },
      { type: "empty string", value: "", output: "" },
      { type: "number", value: 42, output: 42 },
      { type: "zero", value: 0, output: 0 },
      { type: "Set", value: new Set([1, 2, 3]), output: [1, 2, 3] },
      // Duration should output in seconds
      { type: "Duration", value: Duration.fromMillis(100000), output: 100 },
      {
        type: "DateTime",
        value: DateTime.fromISO("2019-01-01T00:00:00"),
        output: DateTime.fromISO("2019-01-01T00:00:00").toISO(),
      },
    ].forEach(({ type, value, output }) => {
      it(`should handle ${type} on basic toFormData() request`, () => {
        const model = new MockModel({ id: 1, test: value });
        assertToFormData(model, { id: 1, test: output });
        assertToFormDataWithCreate(model, {});
        assertToFormDataWithUpdate(model, {});
      });

      it(`should handle ${type} on toFormData({create: true}) request`, () => {
        class Model extends MockModel {
          @bawPersistAttr({
            create: true,
            update: false,
            supportedFormats: ["formData"],
          })
          public test: any;
        }
        const model = new Model({ id: 1, test: value });
        assertToFormData(model, { id: 1, test: output });
        assertToFormDataWithCreate(model, { test: output });
        assertToFormDataWithUpdate(model, {});
      });

      it(`should handle ${type} on toFormData({update: true}) request`, () => {
        class Model extends MockModel {
          @bawPersistAttr({
            create: false,
            update: true,
            supportedFormats: ["formData"],
          })
          public test: any;
        }
        const model = new Model({ id: 1, test: value });
        assertToFormData(model, { id: 1, test: output });
        assertToFormDataWithCreate(model, {});
        assertToFormDataWithUpdate(model, { test: output });
      });
    });

    let defaultData: any;
    beforeEach(() => {
      defaultData = { id: 1, name: "name", set: new Set([1, 2, 3]) };
    });

    it("should filter out injector on basic toFormData() request", () => {
      class MockInjector extends Injector {
        public get(_token: any): any {
          return undefined;
        }
      }
      const mockInjector = new MockInjector() as AssociationInjector;
      const model = new MockModel(defaultData, mockInjector);
      expect(model["injector"]).toEqual(mockInjector);
      expect<any>(Object.keys(model.getFormDataOnlyAttributes())).not.toContain(
        "injector"
      );
    });

    it("should handle multiple on basic toFormData() request", () => {
      const model = new MockModel(defaultData);
      assertToFormData(model, { id: 1, name: "name", set: [1, 2, 3] });
    });

    it("should handle multiple on toFormData({create: true}) request", () => {
      class Model extends MockModel {
        @bawPersistAttr({ create: true, supportedFormats: ["formData"] })
        public name: string;
        @bawPersistAttr({ create: true, supportedFormats: ["formData"] })
        public set: Set<number>;
      }
      const model = new Model(defaultData);
      assertToFormDataWithCreate(model, { name: "name", set: [1, 2, 3] });
    });

    it("should handle multiple on toFormData({update: true}) request", () => {
      class Model extends MockModel {
        @bawPersistAttr({ update: true, supportedFormats: ["formData"] })
        public name: string;
        @bawPersistAttr({ update: true, supportedFormats: ["formData"] })
        public set: Set<number>;
      }
      const model = new Model(defaultData);
      assertToFormDataWithUpdate(model, { name: "name", set: [1, 2, 3] });
    });
  });

  describe("metadata", () => {
    let model: AbstractModel;
    beforeEach(() => {
      class Model extends MockModel {}
      model = new Model({ id: 1 });
    });

    it("should retrieve metadata", () => {
      model.addMetadata({ status: 200, message: "OK" });
      expect(model.getMetadata()).toEqual({
        status: 200,
        message: "OK",
      });
    });

    it("should retrieve empty metadata", () => {
      expect(model.getMetadata()).toBe(undefined);
    });
  });
});
