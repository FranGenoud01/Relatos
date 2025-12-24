import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AportarExamenComponent } from './aportar-examen';

describe('AportarExamen', () => {
  let component: AportarExamenComponent;
  let fixture: ComponentFixture<AportarExamenComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AportarExamenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AportarExamenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
