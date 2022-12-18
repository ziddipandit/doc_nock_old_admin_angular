import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysiciansComponent } from './physicians.component';

describe('PhysiciansComponent', () => {
  let component: PhysiciansComponent;
  let fixture: ComponentFixture<PhysiciansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysiciansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhysiciansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
