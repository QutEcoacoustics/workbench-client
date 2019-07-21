import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutEthicsComponent } from './ethics.component';

describe('AboutEthicsComponent', () => {
  let component: AboutEthicsComponent;
  let fixture: ComponentFixture<AboutEthicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutEthicsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutEthicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
