import { Component, OnInit, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Beer } from './models/beer.model';
import { HeaderComponent } from './components/header/header.component';
import { FiltersComponent } from './components/filters/filters.component';
import { BeerCardComponent } from './components/beer-card/beer-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BeerDetailModalComponent } from './components/beer-detail-modal/beer-detail-modal.component';
import { AppState } from './store';
import * as BeerActions from './store/beer/beer.actions';
import * as FiltersActions from './store/filters/filters.actions';
import {
  selectBeers,
  selectLoading,
  selectError
} from './store/beer/beer.selectors';
import {
  selectFilterName,
  selectFilterAlcohol,
  selectFilterFavorites,
  selectSortOrder
} from './store/filters/filters.selectors';
import { BeerService } from './services/beer.service';
import { FILTER_CONSTANTS, SCROLL_CONSTANTS } from './constants/app.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FiltersComponent, BeerCardComponent, FooterComponent, BeerDetailModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  beers$: Observable<Beer[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  filterName$: Observable<string>;
  filterAlcohol$: Observable<number>;
  filterFavorites$: Observable<boolean>;
  sortOrder$: Observable<string>;

  selectedBeer: Beer | null = null;
  private previousBeerCount = 0;
  private scrollPositionBeforeLoad = 0;
  showScrollTop = false;

  constructor(private store: Store<AppState>, private beerService: BeerService) {
    this.beers$ = this.store.select(selectBeers);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);

    this.filterName$ = this.store.select(selectFilterName);
    this.filterAlcohol$ = this.store.select(selectFilterAlcohol);
    this.filterFavorites$ = this.store.select(selectFilterFavorites);
    this.sortOrder$ = this.store.select(selectSortOrder);

    this.setupScrollPositionTracking();
  }

  ngOnInit() {
    const defaultFilters = { name: '', alcohol: FILTER_CONSTANTS.MAX_ALCOHOL_PERCENTAGE, favorites: false, sort: 'name_asc' };
    this.store.dispatch(BeerActions.loadBeers({ filters: defaultFilters }));
  }

  private setupScrollPositionTracking(): void {
    // Track beer count changes to restore scroll position
    this.beers$.subscribe(beers => {
      if (beers && beers.length > this.previousBeerCount && this.scrollPositionBeforeLoad > 0) {
        setTimeout(() => {
          window.scrollTo({ top: this.scrollPositionBeforeLoad, behavior: 'instant' });
          this.scrollPositionBeforeLoad = 0;
        }, SCROLL_CONSTANTS.SCROLL_RESTORE_DELAY_MS);
      }
      this.previousBeerCount = beers ? beers.length : 0;
    });
  }

  onFiltersChanged(filters: { name: string; alcohol: number; favorites: boolean; sort: string }) {
    this.store.dispatch(FiltersActions.updateFilters(filters));
    this.store.dispatch(BeerActions.loadBeers({ filters }));
  }

  toggleFavorite(beer: Beer) {
    this.store.dispatch(BeerActions.toggleFavorite({ beer }));
  }

  openBeerDetail(beer: Beer) {
    this.selectedBeer = beer;
  }

  closeBeerDetail() {
    this.selectedBeer = null;
  }

  loadMore() {
    this.scrollPositionBeforeLoad = window.pageYOffset || document.documentElement.scrollTop;
    const filters = this.getCurrentFilters();
    this.store.dispatch(BeerActions.loadMoreBeers({ filters }));
  }

  private getCurrentFilters(): { name: string; alcohol: number; favorites: boolean; sort: string } {
    let name = '';
    let alcohol = 0;
    let favorites = false;
    let sort = '';

    this.filterName$.subscribe(n => name = n);
    this.filterAlcohol$.subscribe(a => alcohol = a);
    this.filterFavorites$.subscribe(f => favorites = f);
    this.sortOrder$.subscribe(s => sort = s);

    return { name, alcohol, favorites, sort };
  }

  hasMoreBeers(): boolean {
    return this.beerService.hasMoreBeers();
  }

  trackByBeer(index: number, beer: Beer): number {
    return beer.id;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop = (window.pageYOffset || document.documentElement.scrollTop) > SCROLL_CONSTANTS.SCROLL_TOP_THRESHOLD;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}