import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { DebugElement } from '@angular/core';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let compiled: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it('should not create with missing title', () => {
    expect(() => {
      fixture.detectChanges();
    }).toThrow();
  });

  it('should create', () => {
    component.title = 'title';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
