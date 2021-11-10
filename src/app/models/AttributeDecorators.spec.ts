import { Injector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Id, Ids, ImageSizes, ImageUrl } from "@interfaces/apiInterfaces";
import { assetRoot } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { modelData } from "@test/helpers/faker";
import { DateTime, Duration } from "luxon";
import { AbstractModel } from "./AbstractModel";
import {
  BawAttributeMeta,
  bawCollection,
  bawDateTime,
  BawDecoratorOptions,
  bawDuration,
  bawImage,
  bawPersistAttr,
} from "./AttributeDecorators";

class BaseModel extends AbstractModel {
  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

describe("Attribute Decorators", () => {
  function getModelKeys(
    model: AbstractModel,
    supportedFormat: "json" | "formData",
    callback: (attr: BawAttributeMeta) => boolean
  ): string[] {
    return model
      .getPersistentAttributes()
      .filter((attr) => attr.supportedFormats.includes(supportedFormat))
      .filter(callback)
      .map((attr) => attr.key);
  }

  function assertCreateJsonAttributes(model: AbstractModel, keys: string[]) {
    expect(getModelKeys(model, "json", (attr) => attr.create)).toEqual(keys);
  }

  function assertUpdateJsonAttributes(model: AbstractModel, keys: string[]) {
    expect(getModelKeys(model, "json", (attr) => attr.update)).toEqual(keys);
  }

  function assertCreateFormDataAttributes(
    model: AbstractModel,
    keys: string[]
  ) {
    expect(getModelKeys(model, "formData", (attr) => attr.create)).toEqual(
      keys
    );
  }

  function assertUpdateFormDataAttributes(
    model: AbstractModel,
    keys: string[]
  ) {
    expect(getModelKeys(model, "formData", (attr) => attr.update)).toEqual(
      keys
    );
  }

  describe("BawPersistAttr", () => {
    describe("json", () => {
      it("should append key to model create attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({ create: true, update: false })
          public readonly name: string;
        }
        const model = new MockModel({});
        assertCreateJsonAttributes(model, ["name"]);
        assertUpdateJsonAttributes(model, []);
      });

      it("should append key to model update attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({ create: false, update: true })
          public readonly name: string;
        }
        const model = new MockModel({});
        assertCreateJsonAttributes(model, []);
        assertUpdateJsonAttributes(model, ["name"]);
      });

      it("should append multiple keys to model create attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({ create: true, update: false })
          public readonly name: string;
          @bawPersistAttr({ create: true, update: false })
          public readonly value: number;
        }
        const model = new MockModel({});
        assertCreateJsonAttributes(model, ["name", "value"]);
        assertUpdateJsonAttributes(model, []);
      });

      it("should append multiple keys to model update attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({ create: false, update: true })
          public readonly name: string;
          @bawPersistAttr({ create: false, update: true })
          public readonly value: number;
        }
        const model = new MockModel({});
        assertCreateJsonAttributes(model, []);
        assertUpdateJsonAttributes(model, ["name", "value"]);
      });

      it("should append key to model attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr()
          public readonly name: string;
        }
        const model = new MockModel({});
        assertCreateJsonAttributes(model, ["name"]);
        assertUpdateJsonAttributes(model, ["name"]);
      });

      it("should append multiple keys to model attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr()
          public readonly name: string;
          @bawPersistAttr()
          public readonly value: number;
        }
        const model = new MockModel({});
        assertCreateJsonAttributes(model, ["name", "value"]);
        assertUpdateJsonAttributes(model, ["name", "value"]);
      });
    });

    describe("formData", () => {
      it("should append key to model create attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({
            create: true,
            update: false,
            supportedFormats: ["formData"],
          })
          public readonly name: string;
        }
        const model = new MockModel({});
        assertCreateFormDataAttributes(model, ["name"]);
        assertUpdateFormDataAttributes(model, []);
      });

      it("should append key to model update attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({
            create: false,
            update: true,
            supportedFormats: ["formData"],
          })
          public readonly name: string;
        }
        const model = new MockModel({});
        assertCreateFormDataAttributes(model, []);
        assertUpdateFormDataAttributes(model, ["name"]);
      });

      it("should append multiple keys to model create attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({
            create: true,
            update: false,
            supportedFormats: ["formData"],
          })
          public readonly name: string;
          @bawPersistAttr({
            create: true,
            update: false,
            supportedFormats: ["formData"],
          })
          public readonly value: number;
        }
        const model = new MockModel({});
        assertCreateFormDataAttributes(model, ["name", "value"]);
        assertUpdateFormDataAttributes(model, []);
      });

      it("should append multiple keys to model update attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({
            create: false,
            update: true,
            supportedFormats: ["formData"],
          })
          public readonly name: string;
          @bawPersistAttr({
            create: false,
            update: true,
            supportedFormats: ["formData"],
          })
          public readonly value: number;
        }
        const model = new MockModel({});
        assertCreateFormDataAttributes(model, []);
        assertUpdateFormDataAttributes(model, ["name", "value"]);
      });

      it("should append key to model attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({ supportedFormats: ["formData"] })
          public readonly name: string;
        }
        const model = new MockModel({});
        assertCreateFormDataAttributes(model, ["name"]);
        assertUpdateFormDataAttributes(model, ["name"]);
      });

      it("should append multiple keys to model attributes", () => {
        class MockModel extends BaseModel {
          @bawPersistAttr({ supportedFormats: ["formData"] })
          public readonly name: string;
          @bawPersistAttr({ supportedFormats: ["formData"] })
          public readonly value: number;
        }
        const model = new MockModel({});
        assertCreateFormDataAttributes(model, ["name", "value"]);
        assertUpdateFormDataAttributes(model, ["name", "value"]);
      });
    });
  });

  describe("BawImage", () => {
    let defaultImageUrls: ImageUrl[];
    let defaultImageUrl: ImageUrl;

    beforeEach(() => {
      defaultImageUrls = modelData.imageUrls();
      defaultImageUrl = {
        url: `${assetRoot}/broken_link.png`,
        size: ImageSizes.default,
      };
    });

    function createModel(
      data?: { images?: ImageUrl[] | string; imageUrls?: ImageUrl[] },
      opts?: BawDecoratorOptions<any>,
      injector?: Injector
    ) {
      class MockModel extends BaseModel {
        @bawImage(defaultImageUrl.url, opts)
        public readonly images: ImageUrl[];
        public readonly imageUrls: ImageUrl[];

        public override toString() {
          return "MockModel";
        }
      }

      return new MockModel(data, injector);
    }

    it("should handle persist option", () => {
      const model = createModel(
        { images: defaultImageUrls },
        { persist: true }
      );
      assertCreateJsonAttributes(model, ["images"]);
      assertUpdateJsonAttributes(model, ["images"]);
    });

    it("should handle persist on create option", () => {
      const model = createModel(
        { images: defaultImageUrls },
        { persist: { create: true, update: false } }
      );
      assertCreateJsonAttributes(model, ["images"]);
      assertUpdateJsonAttributes(model, []);
    });

    it("should handle persist on update option", () => {
      const model = createModel(
        { images: defaultImageUrls },
        { persist: { create: false, update: true } }
      );
      assertCreateJsonAttributes(model, []);
      assertUpdateJsonAttributes(model, ["images"]);
    });

    it("should handle override key option", () => {
      const model = createModel(
        { imageUrls: defaultImageUrls },
        { key: "imageUrls" }
      );
      expect(model.images).toEqual([...defaultImageUrls, defaultImageUrl]);
      expect(model.imageUrls).toEqual(defaultImageUrls);
    });

    it("should convert undefined", () => {
      const model = createModel({ images: undefined });
      expect(model.images).toEqual([defaultImageUrl]);
    });

    it("should convert null", () => {
      const model = createModel({ images: null });
      expect(model.images).toEqual([defaultImageUrl]);
    });

    it("should convert single url string", () => {
      const imageUrl: ImageUrl = {
        url: modelData.imageUrl(),
        size: ImageSizes.unknown,
      };
      const model = createModel({ images: imageUrl.url });
      expect(model.images).toEqual([imageUrl, defaultImageUrl]);
    });

    it("should convert empty array", () => {
      const model = createModel({ images: [] });
      expect(model.images).toEqual([defaultImageUrl]);
    });

    it("should convert single item array", () => {
      const imageUrls = defaultImageUrls.slice(0, 1);
      const model = createModel({ images: imageUrls });
      expect(model.images).toEqual([...imageUrls, defaultImageUrl]);
    });

    it("should convert multiple items array", () => {
      const model = createModel({ images: defaultImageUrls });
      expect(model.images).toEqual([...defaultImageUrls, defaultImageUrl]);
    });

    it("should not double append default image", () => {
      const imageUrls = [...defaultImageUrls, defaultImageUrl];
      const model = createModel({ images: imageUrls });
      expect(model.images).toEqual(imageUrls);
    });

    it("should sort array", () => {
      const imageUrls = modelData.shuffleArray(defaultImageUrls.slice());
      const model = createModel({ images: imageUrls });
      expect(model.images).toEqual([...defaultImageUrls, defaultImageUrl]);
    });

    describe("prepend api root", () => {
      let injector: Injector;
      let apiRoot: string;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [MockAppConfigModule],
        }).compileComponents();
        injector = TestBed.inject(Injector);
        apiRoot = TestBed.inject(API_ROOT);
      });

      it("should prepend api root to url if it starts with /", () => {
        const url = "/relative_path/image.jpg";
        const model = createModel({ images: url }, {}, injector);
        expect(model.images).toEqual([
          { url: apiRoot + url, size: ImageSizes.unknown },
          defaultImageUrl,
        ]);
      });

      it("should prepend api root to urls if they starts with /", () => {
        const url = "/relative_path/image.jpg";
        const imageUrl: ImageUrl = { url, size: ImageSizes.unknown };
        const model = createModel({ images: [imageUrl] }, {}, injector);
        expect(model.images).toEqual([
          { url: apiRoot + url, size: ImageSizes.unknown },
          defaultImageUrl,
        ]);
      });
    });
  });

  describe("BawCollection", () => {
    function createModel(
      data: { ids?: Id[]; overrideIds?: Id[] },
      opts?: BawDecoratorOptions<any>
    ) {
      class MockModel extends BaseModel {
        @bawCollection(opts)
        public readonly ids: Ids;
        public readonly overrideIds: Id[];
      }

      return new MockModel(data);
    }

    it("should handle persist option", () => {
      const model = createModel({ ids: [1, 2, 3] }, { persist: true });
      assertCreateJsonAttributes(model, ["ids"]);
      assertUpdateJsonAttributes(model, ["ids"]);
    });

    it("should handle persist on create option", () => {
      const model = createModel(
        { ids: [1, 2, 3] },
        { persist: { create: true, update: false } }
      );
      assertCreateJsonAttributes(model, ["ids"]);
      assertUpdateJsonAttributes(model, []);
    });

    it("should handle persist on update option", () => {
      const model = createModel(
        { ids: [1, 2, 3] },
        { persist: { create: false, update: true } }
      );
      assertCreateJsonAttributes(model, []);
      assertUpdateJsonAttributes(model, ["ids"]);
    });

    it("should handle override key option", () => {
      const model = createModel(
        { overrideIds: [1, 2, 3] },
        { key: "overrideIds" }
      );
      expect(model.ids).toEqual(new Set([1, 2, 3]));
      expect(model.overrideIds).toEqual([1, 2, 3]);
    });

    it("should convert undefined", () => {
      const model = createModel({ ids: undefined });
      expect(model.ids).toEqual(new Set([]));
    });

    it("should convert null", () => {
      const model = createModel({ ids: null });
      expect(model.ids).toEqual(new Set([]));
    });

    it("should convert empty array", () => {
      const model = createModel({ ids: [] });
      expect(model.ids).toEqual(new Set([]));
    });

    it("should convert single value array", () => {
      const model = createModel({ ids: [1] });
      expect(model.ids).toEqual(new Set([1]));
    });

    it("should convert multi value array", () => {
      const model = createModel({ ids: [1, 2, 3] });
      expect(model.ids).toEqual(new Set([1, 2, 3]));
    });
  });

  describe("BawDateTime", () => {
    let defaultDate: DateTime;

    beforeEach(() => {
      defaultDate = DateTime.fromISO(modelData.timestamp(), {
        setZone: true,
      });
    });

    function createModel(
      data: { date?: string; timestamp?: string },
      opts?: BawDecoratorOptions<any>
    ) {
      class MockModel extends BaseModel {
        @bawDateTime(opts)
        public readonly date: DateTime;
        public readonly timestamp: string;
      }

      return new MockModel(data);
    }

    it("should handle persist option", () => {
      const model = createModel(
        { date: defaultDate.toISO() },
        { persist: true }
      );
      assertCreateJsonAttributes(model, ["date"]);
      assertUpdateJsonAttributes(model, ["date"]);
    });

    it("should handle persist on create option", () => {
      const model = createModel(
        { date: defaultDate.toISO() },
        { persist: { create: true, update: false } }
      );
      assertCreateJsonAttributes(model, ["date"]);
      assertUpdateJsonAttributes(model, []);
    });

    it("should handle persist on update option", () => {
      const model = createModel(
        { date: defaultDate.toISO() },
        { persist: { create: false, update: true } }
      );
      assertCreateJsonAttributes(model, []);
      assertUpdateJsonAttributes(model, ["date"]);
    });

    it("should handle override key option", () => {
      const model = createModel(
        { timestamp: defaultDate.toISO() },
        { key: "timestamp" }
      );
      expect(model.date).toEqual(defaultDate);
      expect(model.timestamp).toEqual(defaultDate.toISO());
    });

    it("should convert undefined", () => {
      const model = createModel({ date: undefined });
      expect(model.date).toEqual(null);
    });

    it("should convert null", () => {
      const model = createModel({ date: null });
      expect(model.date).toEqual(null);
    });

    it("should convert timestamp string", () => {
      const model = createModel({ date: defaultDate.toISO() });
      expect(model.date).toEqual(defaultDate);
    });
  });

  describe("BawDuration", () => {
    const defaultSeconds = 100;
    let defaultDuration: Duration;

    function createModel(
      data: { duration?: number; seconds?: number },
      opts?: BawDecoratorOptions<any>
    ) {
      class MockModel extends BaseModel {
        @bawDuration(opts)
        public readonly duration: Duration;
        public readonly seconds: number;
      }

      return new MockModel(data);
    }

    beforeEach(() => {
      defaultDuration = Duration.fromObject({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 1,
        seconds: 40,
      });
    });

    it("should handle persist option", () => {
      const model = createModel(
        { duration: defaultSeconds },
        { persist: true }
      );
      assertCreateJsonAttributes(model, ["duration"]);
      assertUpdateJsonAttributes(model, ["duration"]);
    });

    it("should handle persist on create option", () => {
      const model = createModel(
        { duration: defaultSeconds },
        { persist: { create: true, update: false } }
      );
      assertCreateJsonAttributes(model, ["duration"]);
      assertUpdateJsonAttributes(model, []);
    });

    it("should handle persist on update option", () => {
      const model = createModel(
        { duration: defaultSeconds },
        { persist: { create: false, update: true } }
      );
      assertCreateJsonAttributes(model, []);
      assertUpdateJsonAttributes(model, ["duration"]);
    });

    it("should handle override key option", () => {
      const model = createModel(
        { seconds: defaultSeconds },
        { key: "seconds" }
      );
      expect(model.duration).toEqual(defaultDuration);
      expect(model.seconds).toEqual(defaultSeconds);
    });

    it("should convert undefined", () => {
      const model = createModel({ duration: undefined });
      expect(model.duration).toEqual(null);
    });

    it("should convert null", () => {
      const model = createModel({ duration: null });
      expect(model.duration).toEqual(null);
    });

    it("should convert duration string", () => {
      const model = createModel({ duration: defaultSeconds });
      expect(model.duration).toEqual(defaultDuration);
    });
  });
});
