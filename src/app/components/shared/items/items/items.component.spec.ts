import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { List } from 'immutable';
import { SharedModule } from '../../shared.module';
import { ItemComponent } from '../item/item.component';
import { ItemsComponent } from './items.component';

describe('ItemsComponent', () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;
  let defaultIcon: IconProp;

  function getItems(): NodeListOf<HTMLElement> {
    return (fixture.nativeElement as HTMLElement).querySelectorAll(
      'baw-items-item'
    );
  }

  function getLeftColumn() {
    return (fixture.nativeElement as HTMLElement)
      .querySelectorAll('ul.list-group')[0]
      .querySelectorAll('baw-items-item');
  }

  function getRightColumn() {
    return (fixture.nativeElement as HTMLElement)
      .querySelectorAll('ul.list-group')[1]
      .querySelectorAll('baw-items-item');
  }

  function assertItem(item: HTMLElement, name: string) {
    const label: HTMLElement = item.querySelector('span#name');
    expect(label.innerText.trim()).toBe(name);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [ItemsComponent, ItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
    defaultIcon = ['fas', 'home'];
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create single item', () => {
    component.items = List([{ icon: defaultIcon, name: 'test', value: 0 }]);
    fixture.detectChanges();

    const items = getItems();
    expect(items.length).toBe(1);
    assertItem(items[0], 'test');
  });

  it('should create two items', () => {
    component.items = List([
      { icon: defaultIcon, name: 'test 1', value: 0 },
      { icon: defaultIcon, name: 'test 2', value: 42 },
    ]);
    fixture.detectChanges();

    const items = getItems();
    expect(items.length).toBe(2);
    assertItem(items[0], 'test 1');
    assertItem(items[1], 'test 2');
  });

  it('should create even multiple of items', () => {
    component.items = List([
      { icon: defaultIcon, name: 'test 1', value: 0 },
      { icon: defaultIcon, name: 'test 2', value: 42 },
      { icon: defaultIcon, name: 'test 3', value: 256 },
      { icon: defaultIcon, name: 'test 4', value: 1024 },
    ]);
    fixture.detectChanges();

    expect(getItems().length).toBe(4);
    expect(getLeftColumn().length).toBe(2);
    expect(getRightColumn().length).toBe(2);
  });

  it('should create odd multiple of items', () => {
    component.items = List([
      { icon: defaultIcon, name: 'test 1', value: 0 },
      { icon: defaultIcon, name: 'test 2', value: 42 },
      { icon: defaultIcon, name: 'test 3', value: 256 },
    ]);
    fixture.detectChanges();

    expect(getItems().length).toBe(3);
    expect(getLeftColumn().length).toBe(2);
    expect(getRightColumn().length).toBe(1);
  });

  // TODO Add check that columns inline on small devices
});
