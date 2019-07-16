import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsComponent } from './cards.component';
import { CardComponent } from './card/card.component';
import { CardImageComponent } from './card-image/card-image.component';
import { DebugElement } from '@angular/core';
import { List } from 'immutable';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;
  let compiled: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent, CardImageComponent, CardsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it('should create', () => {
    component.cards = List([{ title: 'title' }]);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not create with missing cards', () => {
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should create single card', () => {
    component.cards = List([{ title: 'title' }]);
    fixture.detectChanges();

    const cards = compiled.nativeElement.querySelectorAll('app-card');
    expect(cards.length).toBe(1);
  });

  it('should create multiple cards', () => {
    component.cards = List([{ title: 'title' }, { title: 'title' }]);
    fixture.detectChanges();

    const cards = compiled.nativeElement.querySelectorAll('app-card');
    expect(cards.length).toBe(2);
  });

  it('should create card with title', () => {
    component.cards = List([{ title: 'title' }]);
    fixture.detectChanges();

    // Create test card
    const cardFixture = TestBed.createComponent(CardComponent);
    const cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title';
    cardFixture.detectChanges();
    const testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    const card = compiled.nativeElement.querySelectorAll('app-card .card')[0];
    expect(card).toEqual(testCard);
  });

  it('should create card with description', () => {
    component.cards = List([{ title: 'title', description: 'description' }]);
    fixture.detectChanges();

    // Create test card
    const cardFixture = TestBed.createComponent(CardComponent);
    const cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title';
    cardComponent.description = 'description';
    cardFixture.detectChanges();
    const testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    const card = compiled.nativeElement.querySelectorAll('app-card .card')[0];
    expect(card).toEqual(testCard);
  });

  it('should create card with link', () => {
    component.cards = List([{ title: 'title', link: 'https://link/' }]);
    fixture.detectChanges();

    // Create test card
    const cardFixture = TestBed.createComponent(CardComponent);
    const cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title';
    cardComponent.link = 'https://link/';
    cardFixture.detectChanges();
    const testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    const card = compiled.nativeElement.querySelectorAll('app-card .card')[0];
    expect(card).toEqual(testCard);
  });

  it('should create multiple cards in correct order', () => {
    component.cards = List([{ title: 'title1' }, { title: 'title2' }]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title1';
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title2';
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });

  it('should create multiple cards with same titles', () => {
    component.cards = List([{ title: 'title' }, { title: 'title' }]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card .card');

    // Create first card
    const cardFixture = TestBed.createComponent(CardComponent);
    const cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title';
    cardFixture.detectChanges();
    const testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);
    expect(cards[1]).toEqual(testCard);
  });

  it('should create multiple cards with different descriptions', () => {
    component.cards = List([
      { title: 'title1', description: 'desc1' },
      { title: 'title2', description: 'desc2' }
    ]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title1';
    cardComponent.description = 'desc1';
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title2';
    cardComponent.description = 'desc2';
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });

  it('should create multiple cards with different links', () => {
    component.cards = List([
      { title: 'title1', link: 'https://link1/' },
      { title: 'title2', link: 'https://link2/' }
    ]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title1';
    cardComponent.link = 'https://link1/';
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title2';
    cardComponent.link = 'https://link2/';
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });

  it('should create multiple cards with multiple params', () => {
    component.cards = List([
      { title: 'title1', description: 'desc1', link: 'https://link1/' },
      { title: 'title2', description: 'desc2', link: 'https://link2/' }
    ]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title1';
    cardComponent.description = 'desc1';
    cardComponent.link = 'https://link1/';
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title2';
    cardComponent.description = 'desc2';
    cardComponent.link = 'https://link2/';
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });

  it('should create single image card', () => {
    component.cards = List([{ title: 'title', image: { url: 'image', alt: 'alt' } }]);
    fixture.detectChanges();

    const card = compiled.nativeElement.querySelectorAll('app-card-image');
    expect(card.length).toBe(1);
  });

  it('should create multiple image cards', () => {
    component.cards = List([
      { title: 'title', image: { url: 'image', alt: 'alt' } },
      { title: 'title', image: { url: 'image', alt: 'alt' } }
    ]);
    fixture.detectChanges();

    const cards = compiled.nativeElement.querySelectorAll('app-card-image');
    expect(cards.length).toBe(2);
  });

  it('should not create with some cards containing images and others not', () => {
    component.cards = List([{ title: 'title', image: { url: 'image', alt: 'alt' } }, { title: 'title' }]);

    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should create image card with title and image', () => {
    component.cards = List([{ title: 'title', image: { url: 'image', alt: 'alt' } }]);
    fixture.detectChanges();

    // Create test card
    const cardFixture = TestBed.createComponent(CardImageComponent);
    const cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title';
    cardComponent.image = { url: 'image', alt: 'alt' };
    cardFixture.detectChanges();
    const testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    const card = compiled.nativeElement.querySelectorAll('app-card-image .card')[0];
    expect(card).toEqual(testCard);
  });

  it('should create image card with description', () => {
    component.cards = List([
      {
        title: 'title',
        image: { url: 'image', alt: 'alt' },
        description: 'description'
      }
    ]);
    fixture.detectChanges();

    // Create test card
    const cardFixture = TestBed.createComponent(CardImageComponent);
    const cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title';
    cardComponent.image = { url: 'image', alt: 'alt' };
    cardComponent.description = 'description';
    cardFixture.detectChanges();
    const testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    const card = compiled.nativeElement.querySelectorAll('app-card-image .card')[0];
    expect(card).toEqual(testCard);
  });

  it('should create image card with link', () => {
    component.cards = List([
      {
        title: 'title',
        image: { url: 'image', alt: 'alt' },
        link: 'https://link/'
      }
    ]);
    fixture.detectChanges();

    // Create test card
    const cardFixture = TestBed.createComponent(CardImageComponent);
    const cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title';
    cardComponent.image = { url: 'image', alt: 'alt' };
    cardComponent.link = 'https://link/';
    cardFixture.detectChanges();
    const testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    const card = compiled.nativeElement.querySelectorAll('app-card-image .card')[0];
    expect(card).toEqual(testCard);
  });

  it('should create multiple image cards in correct order', () => {
    component.cards = List([
      { title: 'title1', image: { url: 'image1', alt: 'alt1' } },
      { title: 'title2', image: { url: 'image2', alt: 'alt2' } }
    ]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card-image .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardImageComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title1';
    cardComponent.image = { url: 'image1', alt: 'alt1' };
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardImageComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title2';
    cardComponent.image = { url: 'image2', alt: 'alt2' };
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });

  it('should create multiple image cards with same titles', () => {
    component.cards = List([
      { title: 'title', image: { url: 'image1', alt: 'alt1' } },
      { title: 'title', image: { url: 'image2', alt: 'alt2' } }
    ]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card-image .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardImageComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title';
    cardComponent.image = { url: 'image1', alt: 'alt1' };
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardImageComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title';
    cardComponent.image = { url: 'image2', alt: 'alt2' };
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });

  it('should create multiple image cards with same images', () => {
    component.cards = List([
      { title: 'title1', image: { url: 'image', alt: 'alt' } },
      { title: 'title2', image: { url: 'image', alt: 'alt' } }
    ]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card-image .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardImageComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title1';
    cardComponent.image = { url: 'image', alt: 'alt' };
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardImageComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title2';
    cardComponent.image = { url: 'image', alt: 'alt' };
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });

  it('should create multiple image cards with different descriptions', () => {
    component.cards = List([
      {
        title: 'title1',
        image: { url: 'image1', alt: 'alt1' },
        description: 'desc1'
      },
      {
        title: 'title2',
        image: { url: 'image2', alt: 'alt2' },
        description: 'desc2'
      }
    ]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card-image .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardImageComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title1';
    cardComponent.image = { url: 'image1', alt: 'alt1' };
    cardComponent.description = 'desc1';
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardImageComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title2';
    cardComponent.image = { url: 'image2', alt: 'alt2' };
    cardComponent.description = 'desc2';
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });

  it('should create multiple image cards with different links', () => {
    component.cards = List([
      {
        title: 'title1',
        image: { url: 'image1', alt: 'alt1' },
        link: 'https://link1/'
      },
      {
        title: 'title2',
        image: { url: 'image2', alt: 'alt2' },
        link: 'https://link2/'
      }
    ]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card-image .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardImageComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title1';
    cardComponent.image = { url: 'image1', alt: 'alt1' };
    cardComponent.link = 'https://link1/';
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardImageComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title2';
    cardComponent.image = { url: 'image2', alt: 'alt2' };
    cardComponent.link = 'https://link2/';
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });

  it('should create multiple image cards with multiple params', () => {
    component.cards = List([
      {
        title: 'title1',
        image: { url: 'image1', alt: 'alt1' },
        description: 'desc1',
        link: 'https://link1/'
      },
      {
        title: 'title2',
        image: { url: 'image2', alt: 'alt2' },
        description: 'desc2',
        link: 'https://link2/'
      }
    ]);
    fixture.detectChanges();
    const cards = compiled.nativeElement.querySelectorAll('app-card-image .card');

    // Create first card
    let cardFixture = TestBed.createComponent(CardImageComponent);
    let cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title1';
    cardComponent.image = { url: 'image1', alt: 'alt1' };
    cardComponent.description = 'desc1';
    cardComponent.link = 'https://link1/';
    cardFixture.detectChanges();
    let testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[0]).toEqual(testCard);

    // Create second card
    cardFixture = TestBed.createComponent(CardImageComponent);
    cardComponent = cardFixture.componentInstance;
    cardComponent.title = 'title2';
    cardComponent.image = { url: 'image2', alt: 'alt2' };
    cardComponent.description = 'desc2';
    cardComponent.link = 'https://link2/';
    cardFixture.detectChanges();
    testCard = cardFixture.debugElement.nativeElement.querySelectorAll('.card')[0];

    expect(cards[1]).toEqual(testCard);
  });
});
