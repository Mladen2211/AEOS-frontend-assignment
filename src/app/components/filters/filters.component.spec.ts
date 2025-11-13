/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { FiltersComponent } from './filters.component';
import { FILTER_CONSTANTS } from '../../constants/app.constants';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersComponent, FormsModule],
      providers: [
        provideMockStore({
          initialState: {}
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    (expect(component) as any).toBeTruthy();
  });

  it('should expose FILTER_CONSTANTS to template', () => {
    (expect(component.FILTER_CONSTANTS) as any).toBe(FILTER_CONSTANTS);
  });

  it('should render filter inputs', () => {
    const compiled = fixture.nativeElement;
    (expect(compiled.querySelector('input[id="filterName"]')) as any).toBeTruthy();
    (expect(compiled.querySelector('input[id="filterAlcohol"]')) as any).toBeTruthy();
    (expect(compiled.querySelector('input[id="filterFavorites"]')) as any).toBeTruthy();
    (expect(compiled.querySelector('select[id="sortOrder"]')) as any).toBeTruthy();
  });
});