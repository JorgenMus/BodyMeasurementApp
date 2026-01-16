import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeasurementCreatePage } from './measurement-create.page';

describe('MeasurementCreatePage', () => {
  let component: MeasurementCreatePage;
  let fixture: ComponentFixture<MeasurementCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
