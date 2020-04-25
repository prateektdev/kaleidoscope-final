import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KaleidoscopePage } from './kaleidoscope.page';

describe('KaleidoscopePage', () => {
  let component: KaleidoscopePage;
  let fixture: ComponentFixture<KaleidoscopePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KaleidoscopePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KaleidoscopePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
