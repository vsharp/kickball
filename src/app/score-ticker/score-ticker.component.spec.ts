import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreTickerComponent } from './score-ticker.component';

describe('ScoreTickerComponent', () => {
  let component: ScoreTickerComponent;
  let fixture: ComponentFixture<ScoreTickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreTickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
