import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsMiniComponent } from './transactions-mini.component';

describe('TransactionsMiniComponent', () => {
  let component: TransactionsMiniComponent;
  let fixture: ComponentFixture<TransactionsMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsMiniComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
