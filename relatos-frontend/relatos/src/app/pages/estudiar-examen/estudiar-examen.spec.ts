import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiarExamen } from './estudiar-examen';

describe('EstudiarExamen', () => {
  let component: EstudiarExamen;
  let fixture: ComponentFixture<EstudiarExamen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudiarExamen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudiarExamen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
