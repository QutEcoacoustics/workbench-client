import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactEthicsComponent } from './ethics.component';

describe('ContactEthicsComponent', () => {
  let component: ContactEthicsComponent;
  let fixture: ComponentFixture<ContactEthicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactEthicsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactEthicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
