import { Id, Ids, ImageSizes, ImageUrl } from '@interfaces/apiInterfaces';
import { assetRoot } from '@services/app-config/app-config.service';
import { modelData } from '@test/helpers/faker';
import { DateTime, Duration } from 'luxon';
import { AbstractModel } from './AbstractModel';
import {
  BawCollection,
  BawDateTime,
  BawDecoratorOptions,
  BawDuration,
  BawImage,
  BawPersistAttr,
} from './AttributeDecorators';

class BaseModel extends AbstractModel {
  public get viewUrl(): string {
    throw new Error('Method not implemented.');
  }
}

describe('Attribute Decorators', () => {
  describe('BawPersistAttr', () => {
    it('should append key to model attributes', () => {
      class MockModel extends BaseModel {
        @BawPersistAttr
        public readonly name: string;
      }

      const model = new MockModel({});
      expect(model[AbstractModel.attributeKey]).toEqual(['name']);
    });

    it('should append multiple keys to model attributes', () => {
      class MockModel extends BaseModel {
        @BawPersistAttr
        public readonly name: string;
        @BawPersistAttr
        public readonly value: number;
      }

      const model = new MockModel({});
      expect(model[AbstractModel.attributeKey]).toEqual(['name', 'value']);
    });

    it('should output keys in model toJSON', () => {
      class MockModel extends BaseModel {
        @BawPersistAttr
        public readonly name: string;
        @BawPersistAttr
        public readonly value: number;
      }

      const model = new MockModel({ name: 'test', value: 1 });
      expect(model.toJSON()).toEqual({ name: 'test', value: 1 });
    });
  });

  describe('BawImage', () => {
    let defaultImageUrls: ImageUrl[];
    let defaultImageUrl: ImageUrl;

    beforeEach(() => {
      defaultImageUrls = modelData.imageUrls();
      defaultImageUrl = {
        url: `${assetRoot}/broken_link.png`,
        size: ImageSizes.DEFAULT,
      };
    });

    function createModel(
      data?: { image?: ImageUrl[] | string; imageUrls?: ImageUrl[] },
      opts?: BawDecoratorOptions<any>
    ) {
      class MockModel extends BaseModel {
        @BawImage(defaultImageUrl.url, opts)
        public readonly image: ImageUrl[];
        public readonly imageUrls: ImageUrl[];
      }

      return new MockModel(data);
    }

    it('should handle persist option', () => {
      const model = createModel({ image: defaultImageUrls }, { persist: true });
      expect(model[AbstractModel.attributeKey]).toEqual(['image']);
    });

    it('should handle override key option', () => {
      const model = createModel(
        { imageUrls: defaultImageUrls },
        { key: 'imageUrls' }
      );
      expect(model.image).toEqual([...defaultImageUrls, defaultImageUrl]);
      expect(model.imageUrls).toEqual(defaultImageUrls);
    });

    it('should convert undefined', () => {
      const model = createModel({ image: undefined });
      expect(model.image).toEqual([defaultImageUrl]);
    });

    it('should convert null', () => {
      const model = createModel({ image: null });
      expect(model.image).toEqual([defaultImageUrl]);
    });

    it('should convert single url string', () => {
      const imageUrl: ImageUrl = {
        url: modelData.imageUrl(),
        size: ImageSizes.UNKNOWN,
      };
      const model = createModel({ image: imageUrl.url });
      expect(model.image).toEqual([imageUrl, defaultImageUrl]);
    });

    it('should convert empty array', () => {
      const model = createModel({ image: [] });
      expect(model.image).toEqual([defaultImageUrl]);
    });

    it('should convert single item array', () => {
      const imageUrls = defaultImageUrls.slice(0, 1);
      const model = createModel({ image: imageUrls });
      expect(model.image).toEqual([...imageUrls, defaultImageUrl]);
    });

    it('should convert multiple items array', () => {
      const model = createModel({ image: defaultImageUrls });
      expect(model.image).toEqual([...defaultImageUrls, defaultImageUrl]);
    });

    it('should not double append default image', () => {
      const imageUrls = [...defaultImageUrls, defaultImageUrl];
      const model = createModel({ image: imageUrls });
      expect(model.image).toEqual(imageUrls);
    });

    it('should sort array', () => {
      const imageUrls = modelData.shuffleArray(defaultImageUrls.slice());
      const model = createModel({ image: imageUrls });
      expect(model.image).toEqual([...defaultImageUrls, defaultImageUrl]);
    });
  });

  describe('BawCollection', () => {
    function createModel(
      data: { ids?: Id[]; overrideIds?: Id[] },
      opts?: BawDecoratorOptions<any>
    ) {
      class MockModel extends BaseModel {
        @BawCollection(opts)
        public readonly ids: Ids;
        public readonly overrideIds: Id[];
      }

      return new MockModel(data);
    }

    it('should handle persist option', () => {
      const model = createModel({ ids: [1, 2, 3] }, { persist: true });
      expect(model[AbstractModel.attributeKey]).toEqual(['ids']);
    });

    it('should handle override key option', () => {
      const model = createModel(
        { overrideIds: [1, 2, 3] },
        { key: 'overrideIds' }
      );
      expect(model.ids).toEqual(new Set([1, 2, 3]));
      expect(model.overrideIds).toEqual([1, 2, 3]);
    });

    it('should convert undefined', () => {
      const model = createModel({ ids: undefined });
      expect(model.ids).toEqual(new Set([]));
    });

    it('should convert null', () => {
      const model = createModel({ ids: null });
      expect(model.ids).toEqual(new Set([]));
    });

    it('should convert empty array', () => {
      const model = createModel({ ids: [] });
      expect(model.ids).toEqual(new Set([]));
    });

    it('should convert single value array', () => {
      const model = createModel({ ids: [1] });
      expect(model.ids).toEqual(new Set([1]));
    });

    it('should convert multi value array', () => {
      const model = createModel({ ids: [1, 2, 3] });
      expect(model.ids).toEqual(new Set([1, 2, 3]));
    });
  });

  describe('BawDateTime', () => {
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
        @BawDateTime(opts)
        public readonly date: DateTime;
        public readonly timestamp: string;
      }

      return new MockModel(data);
    }

    it('should handle persist option', () => {
      const model = createModel(
        { date: defaultDate.toISO() },
        { persist: true }
      );
      expect(model[AbstractModel.attributeKey]).toEqual(['date']);
    });

    it('should handle override key option', () => {
      const model = createModel(
        { timestamp: defaultDate.toISO() },
        { key: 'timestamp' }
      );
      expect(model.date).toEqual(defaultDate);
      expect(model.timestamp).toEqual(defaultDate.toISO());
    });

    it('should convert undefined', () => {
      const model = createModel({ date: undefined });
      expect(model.date).toEqual(null);
    });

    it('should convert null', () => {
      const model = createModel({ date: null });
      expect(model.date).toEqual(null);
    });

    it('should convert timestamp string', () => {
      const model = createModel({ date: defaultDate.toISO() });
      expect(model.date).toEqual(defaultDate);
    });
  });

  describe('BawDuration', () => {
    const defaultSeconds = 100;
    let defaultDuration: Duration;

    function createModel(
      data: { duration?: number; seconds?: number },
      opts?: BawDecoratorOptions<any>
    ) {
      class MockModel extends BaseModel {
        @BawDuration(opts)
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

    it('should handle persist option', () => {
      const model = createModel(
        { duration: defaultSeconds },
        { persist: true }
      );
      expect(model[AbstractModel.attributeKey]).toEqual(['duration']);
    });

    it('should handle override key option', () => {
      const model = createModel(
        { seconds: defaultSeconds },
        { key: 'seconds' }
      );
      expect(model.duration).toEqual(defaultDuration);
      expect(model.seconds).toEqual(defaultSeconds);
    });

    it('should convert undefined', () => {
      const model = createModel({ duration: undefined });
      expect(model.duration).toEqual(null);
    });

    it('should convert null', () => {
      const model = createModel({ duration: null });
      expect(model.duration).toEqual(null);
    });

    it('should convert duration string', () => {
      const model = createModel({ duration: defaultSeconds });
      expect(model.duration).toEqual(defaultDuration);
    });
  });
});
