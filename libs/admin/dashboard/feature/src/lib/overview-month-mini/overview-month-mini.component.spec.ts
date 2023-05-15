import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewMonthMiniComponent } from './overview-month-mini.component';

describe('OverviewMonthMiniComponent', () => {
  let component: OverviewMonthMiniComponent;
  let fixture: ComponentFixture<OverviewMonthMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewMonthMiniComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewMonthMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
