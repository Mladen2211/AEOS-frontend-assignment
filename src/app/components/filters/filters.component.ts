import { Component, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { AppState } from '../../store';
import {
  selectFilterName,
  selectFilterAlcohol,
  selectFilterFavorites,
  selectSortOrder
} from '../../store/filters/filters.selectors';
import { FILTER_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div>
          <label for="filterName" class="block text-sm font-medium text-gray-700 mb-1">Filter by name</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input type="text" id="filterName" class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-custom-yellow focus:border-custom-yellow" [(ngModel)]="filterName" (ngModelChange)="onFilterChange()">
          </div>
        </div>

        <div>
          <label for="filterAlcohol" class="block text-sm font-medium text-gray-700 mb-1">Alcohol content (%)</label>
          <input type="range" id="filterAlcohol" min="0" [max]="FILTER_CONSTANTS.MAX_ALCOHOL_PERCENTAGE" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-custom-yellow" [(ngModel)]="filterAlcohol" (ngModelChange)="onFilterChange()">
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>{{ filterAlcohol }}%</span>
            <span>{{ FILTER_CONSTANTS.MAX_ALCOHOL_PERCENTAGE }}%</span>
          </div>
        </div>

        <div class="flex items-center justify-center md:justify-start h-full pb-2">
          <input type="checkbox" id="filterFavorites" class="h-5 w-5 text-custom-yellow border-gray-300 rounded focus:ring-custom-yellow" [(ngModel)]="filterFavorites" (ngModelChange)="onFilterChange()">
          <label for="filterFavorites" class="ml-2 text-sm font-medium text-gray-700">Show only favorites</label>
        </div>

        <div>
          <label for="sortOrder" class="block text-sm font-medium text-gray-700 mb-1">Sort</label>
          <select id="sortOrder" class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-custom-yellow focus:border-custom-yellow" [(ngModel)]="sortOrder" (ngModelChange)="onFilterChange()">
            <option value="name_asc">Sort by name (A-Z)</option>
            <option value="name_desc">Sort by name (Z-A)</option>
            <option value="alcohol_asc">Alcohol (Low-High)</option>
            <option value="alcohol_desc">Alcohol (High-Low)</option>
          </select>
        </div>
      </div>
    </section>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChanged = new EventEmitter<{ name: string; alcohol: number; favorites: boolean; sort: string }>();

  // Make constants available to template
  readonly FILTER_CONSTANTS = FILTER_CONSTANTS;

  filterName = '';
  filterAlcohol = FILTER_CONSTANTS.MAX_ALCOHOL_PERCENTAGE;
  filterFavorites = false;
  sortOrder = 'name_asc';

  private destroy$ = new Subject<void>();
  private filterChanges$ = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    combineLatest([
      this.store.select(selectFilterName).pipe(startWith('')),
      this.store.select(selectFilterAlcohol).pipe(startWith(FILTER_CONSTANTS.MAX_ALCOHOL_PERCENTAGE)),
      this.store.select(selectFilterFavorites).pipe(startWith(false)),
      this.store.select(selectSortOrder).pipe(startWith('name_asc'))
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([name, alcohol, favorites, sort]) => {
      this.filterName = name;
      this.filterAlcohol = alcohol;
      this.filterFavorites = favorites;
      this.sortOrder = sort;
    });

    this.filterChanges$.pipe(
      debounceTime(FILTER_CONSTANTS.DEBOUNCE_TIME_MS),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.emitFilters();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChange() {
    this.filterChanges$.next();
  }

  private emitFilters() {
    this.filtersChanged.emit({
      name: this.filterName,
      alcohol: this.filterAlcohol,
      favorites: this.filterFavorites,
      sort: this.sortOrder
    });
  }
}