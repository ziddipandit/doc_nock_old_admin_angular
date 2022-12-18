import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistedLivingsComponent } from './assisted-livings.component';

describe('AssistedLivingsComponent', () => {
  let component: AssistedLivingsComponent;
  let fixture: ComponentFixture<AssistedLivingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssistedLivingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistedLivingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
