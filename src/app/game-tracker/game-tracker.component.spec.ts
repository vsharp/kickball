import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameTrackerComponent } from './game-tracker.component';

describe('GameTrackerComponent', () => {
  let component: GameTrackerComponent;
  let fixture: ComponentFixture<GameTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
