import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthMiniDiffComponent } from './month-mini-diff.component';

describe('MonthMiniDiffComponent', () => {
  let component: MonthMiniDiffComponent;
  let fixture: ComponentFixture<MonthMiniDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthMiniDiffComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthMiniDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
