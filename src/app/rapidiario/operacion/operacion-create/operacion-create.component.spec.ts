import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionCreateComponent } from './operacion-create.component';

describe('OperacionCreateComponent', () => {
  let component: OperacionCreateComponent;
  let fixture: ComponentFixture<OperacionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperacionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
