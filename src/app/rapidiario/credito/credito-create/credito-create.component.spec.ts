import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditoCreateComponent } from './credito-create.component';

describe('CreditoCreateComponent', () => {
  let component: CreditoCreateComponent;
  let fixture: ComponentFixture<CreditoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditoCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
