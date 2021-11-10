import { Injector } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { AbstractModel, getUnknownViewUrl } from "./AbstractModel";
import { bawPersistAttr } from "./AttributeDecorators";

export class MockModel extends AbstractModel {
  public constructor(raw: Record<string, any>, protected injector?: Injector) {
    super(raw, injector);
  }

  public get viewUrl(): string {
    return getUnknownViewUrl("MockModel does not have a viewUrl");
  }
}

describe("AbstractModel", () => {
  describe("toJSON", () => {
    const assertToJson = (model: AbstractModel, result: Record<string, any>) =>
      expect(model.toJSON()).toEqual(result);
    const assertToJsonWithCreate = (
      model: AbstractModel,
      result: Record<string, any>
    ) => expect(model.toJSON({ create: true })).toEqual(result);
    const assertToJsonWithUpdate = (
      model: AbstractModel,
      result: Record<string, any>
    ) => expect(model.toJSON({ update: true })).toEqual(result);

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
      const mockInjector: Injector = new MockInjector();
      const model = new MockModel(defaultData, mockInjector);
      expect(model["injector"]).toEqual(mockInjector);
      expect<any>(Object.keys(model.toJSON())).not.toContain("injector");
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

  describe("hasFormData", () => {
    it("should return true if form data exists", () => {
      class Model extends MockModel {
        @bawPersistAttr({ supportedFormats: ["formData"] })
        public value0: any;
      }
      const model = new Model({ value0: "value" });
      expect(model.hasFormData()).toBeTrue();
    });

    it("should handle detecting falsy values", () => {
      class Model extends MockModel {
        @bawPersistAttr({ supportedFormats: ["formData"] })
        public value0: any;
      }
      const model = new Model({ value0: 0 });
      expect(model.hasFormData()).toBeTrue();
    });

    it("should return true if only one attribute is instantiated", () => {
      class Model extends MockModel {
        @bawPersistAttr({ supportedFormats: ["formData"] })
        public value0: any;
        @bawPersistAttr({ supportedFormats: ["formData"] })
        public value1: any;
      }
      const model = new Model({ value0: "value" });
      expect(model.hasFormData()).toBeTrue();
    });
    it("should return false is no attributes are instantiated", () => {
      class Model extends MockModel {
        @bawPersistAttr({ supportedFormats: ["formData"] })
        public value0: any;
        @bawPersistAttr({ supportedFormats: ["formData"] })
        public value1: any;
      }
      const model = new Model({});
      expect(model.hasFormData()).toBeFalse();
    });

    it("should return false if no attributes exist", () => {
      class Model extends MockModel {}
      const model = new Model({});
      expect(model.hasFormData()).toBeFalse();
    });
  });

  describe("toFormData", () => {
    const assertToFormData = (
      model: AbstractModel,
      result: Record<string, any>
    ) => expect(model.toFormData()).toEqual(createFormData(result));
    const assertToFormDataWithCreate = (
      model: AbstractModel,
      result: Record<string, any>
    ) =>
      expect(model.toFormData({ create: true })).toEqual(
        createFormData(result)
      );
    const assertToFormDataWithUpdate = (
      model: AbstractModel,
      result: Record<string, any>
    ) =>
      expect(model.toFormData({ update: true })).toEqual(
        createFormData(result)
      );
    const createFormData = (obj: Record<string, any>) => {
      const data = new FormData();
      for (const key of Object.keys(obj)) {
        data.append(key, obj[key]);
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
      const mockInjector: Injector = new MockInjector();
      const model = new MockModel(defaultData, mockInjector);
      expect(model["injector"]).toEqual(mockInjector);
      expect<any>(Object.keys(model.toFormData())).not.toContain("injector");
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
