import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingHomesComponent } from './nursing-homes.component';

describe('NursingHomesComponent', () => {
  let component: NursingHomesComponent;
  let fixture: ComponentFixture<NursingHomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NursingHomesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NursingHomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
