import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "../../shared.module";
import { ItemComponent, ItemInterface } from "../item/item.component";
import { ItemsComponent } from "./items.component";

describe("ItemsComponent", () => {
  let component: ItemsComponent;
  let fixture: ComponentFixture<ItemsComponent>;

  function createItem(details: ItemInterface) {
    const itemFixture = TestBed.createComponent(ItemComponent);
    const itemComponent = itemFixture.componentInstance;

    itemComponent.icon = details.icon;
    itemComponent.name = details.name;
    itemComponent.value = details.value;

    itemFixture.detectChanges();

    return itemFixture.debugElement.nativeElement.innerHTML;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ItemsComponent, ItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should create single number item", () => {
    component.items = [{ icon: ["fas", "home"], name: "test", value: 0 }];

    fixture.detectChanges();

    const items = fixture.debugElement.nativeElement.querySelectorAll(
      "app-items-item"
    );
    expect(items).toBeTruthy();
    expect(items.length).toBe(1);
    expect(items[0].innerHTML).toEqual(
      createItem({ icon: ["fas", "home"], name: "test", value: 0 })
    );
  });

  it("should create single text item", () => {
    component.items = [{ icon: ["fas", "home"], name: "test", value: "value" }];

    fixture.detectChanges();

    const items = fixture.debugElement.nativeElement.querySelectorAll(
      "app-items-item"
    );
    expect(items).toBeTruthy();
    expect(items.length).toBe(1);
    expect(items[0].innerHTML).toEqual(
      createItem({ icon: ["fas", "home"], name: "test", value: "value" })
    );
  });

  it("should create two number items", () => {
    component.items = [
      { icon: ["fas", "home"], name: "test 1", value: 0 },
      { icon: ["fas", "user"], name: "test 2", value: 42 }
    ];

    fixture.detectChanges();

    const items = fixture.debugElement.nativeElement.querySelectorAll(
      "app-items-item"
    );
    expect(items).toBeTruthy();
    expect(items.length).toBe(2);
    expect(items[0].innerHTML).toEqual(
      createItem({ icon: ["fas", "home"], name: "test 1", value: 0 })
    );
    expect(items[1].innerHTML).toEqual(
      createItem({ icon: ["fas", "user"], name: "test 2", value: 42 })
    );
  });

  it("should create two string items", () => {
    component.items = [
      { icon: ["fas", "home"], name: "test 1", value: "value 1" },
      { icon: ["fas", "user"], name: "test 2", value: "value 2" }
    ];

    fixture.detectChanges();

    const items = fixture.debugElement.nativeElement.querySelectorAll(
      "app-items-item"
    );
    expect(items).toBeTruthy();
    expect(items.length).toBe(2);
    expect(items[0].innerHTML).toEqual(
      createItem({ icon: ["fas", "home"], name: "test 1", value: "value 1" })
    );
    expect(items[1].innerHTML).toEqual(
      createItem({ icon: ["fas", "user"], name: "test 2", value: "value 2" })
    );
  });

  it("should create multiple even number items", () => {
    component.items = [
      { icon: ["fas", "home"], name: "test 1", value: 0 },
      { icon: ["fas", "user"], name: "test 2", value: 42 },
      { icon: ["fas", "users"], name: "test 3", value: 256 },
      { icon: ["fas", "question"], name: "test 4", value: 1024 }
    ];

    fixture.detectChanges();

    const items = fixture.debugElement.nativeElement.querySelectorAll(
      "app-items-item"
    );
    expect(items).toBeTruthy();
    expect(items.length).toBe(4);
    expect(items[0].innerHTML).toEqual(
      createItem({ icon: ["fas", "home"], name: "test 1", value: 0 })
    );
    expect(items[1].innerHTML).toEqual(
      createItem({ icon: ["fas", "user"], name: "test 2", value: 42 })
    );
    expect(items[2].innerHTML).toEqual(
      createItem({ icon: ["fas", "users"], name: "test 3", value: 256 })
    );
    expect(items[3].innerHTML).toEqual(
      createItem({ icon: ["fas", "question"], name: "test 4", value: 1024 })
    );
  });

  it("should create multiple even string items", () => {
    component.items = [
      { icon: ["fas", "home"], name: "test 1", value: "value 1" },
      { icon: ["fas", "user"], name: "test 2", value: "value 2" },
      { icon: ["fas", "users"], name: "test 3", value: "value 3" },
      { icon: ["fas", "question"], name: "test 4", value: "value 4" }
    ];

    fixture.detectChanges();

    const items = fixture.debugElement.nativeElement.querySelectorAll(
      "app-items-item"
    );
    expect(items).toBeTruthy();
    expect(items.length).toBe(4);
    expect(items[0].innerHTML).toEqual(
      createItem({ icon: ["fas", "home"], name: "test 1", value: "value 1" })
    );
    expect(items[1].innerHTML).toEqual(
      createItem({ icon: ["fas", "user"], name: "test 2", value: "value 2" })
    );
    expect(items[2].innerHTML).toEqual(
      createItem({ icon: ["fas", "users"], name: "test 3", value: "value 3" })
    );
    expect(items[3].innerHTML).toEqual(
      createItem({
        icon: ["fas", "question"],
        name: "test 4",
        value: "value 4"
      })
    );
  });

  it("should create multiple odd number items", () => {
    component.items = [
      { icon: ["fas", "home"], name: "test 1", value: 0 },
      { icon: ["fas", "user"], name: "test 2", value: 42 },
      { icon: ["fas", "users"], name: "test 3", value: 256 }
    ];

    fixture.detectChanges();

    const items = fixture.debugElement.nativeElement.querySelectorAll(
      "app-items-item"
    );
    expect(items).toBeTruthy();
    expect(items.length).toBe(3);
    expect(items[0].innerHTML).toEqual(
      createItem({ icon: ["fas", "home"], name: "test 1", value: 0 })
    );
    expect(items[1].innerHTML).toEqual(
      createItem({ icon: ["fas", "user"], name: "test 2", value: 42 })
    );
    expect(items[2].innerHTML).toEqual(
      createItem({ icon: ["fas", "users"], name: "test 3", value: 256 })
    );
  });

  it("should create multiple odd string items", () => {
    component.items = [
      { icon: ["fas", "home"], name: "test 1", value: "value 1" },
      { icon: ["fas", "user"], name: "test 2", value: "value 2" },
      { icon: ["fas", "users"], name: "test 3", value: "value 3" }
    ];

    fixture.detectChanges();

    const items = fixture.debugElement.nativeElement.querySelectorAll(
      "app-items-item"
    );
    expect(items).toBeTruthy();
    expect(items.length).toBe(3);
    expect(items[0].innerHTML).toEqual(
      createItem({ icon: ["fas", "home"], name: "test 1", value: "value 1" })
    );
    expect(items[1].innerHTML).toEqual(
      createItem({ icon: ["fas", "user"], name: "test 2", value: "value 2" })
    );
    expect(items[2].innerHTML).toEqual(
      createItem({ icon: ["fas", "users"], name: "test 3", value: "value 3" })
    );
  });
});
