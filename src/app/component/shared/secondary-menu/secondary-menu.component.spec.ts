import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryMenuComponent } from './secondary-menu.component';

describe('SecondaryMenuComponent', () => {
  let component: SecondaryMenuComponent;
  let fixture: ComponentFixture<SecondaryMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
