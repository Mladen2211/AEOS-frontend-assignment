/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { BeerCardComponent } from './beer-card.component';
import { Beer } from '../../models/beer.model';
import { LAZY_LOADING_CONSTANTS } from '../../constants/app.constants';

describe('BeerCardComponent', () => {
  let component: BeerCardComponent;
  let fixture: ComponentFixture<BeerCardComponent>;

  const mockBeer: Beer = {
    id: 1,
    name: 'Test Beer',
    tagline: 'A test beer',
    description: 'This is a test beer',
    abv: 5.0,
    image_url: 'https://example.com/beer.jpg'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeerCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BeerCardComponent);
    component = fixture.componentInstance;
    component.beer = mockBeer;
    fixture.detectChanges();
  });

  it('should create', () => {
    (expect(component) as any).toBeTruthy();
  });

  it('should display beer information', () => {
    const compiled = fixture.nativeElement;
    (expect(compiled.textContent) as any).toContain('Test Beer');
  });

  it('should have fallback image initially', () => {
    (expect(component.imageSrc) as any).toBe(component.fallbackImage);
  });

  describe('onToggleFavorite', () => {
    it('should emit toggleFavorite event', () => {
      spyOn(component.toggleFavorite, 'emit');
      component.onToggleFavorite();
      (expect(component.toggleFavorite.emit) as any).toHaveBeenCalledWith(mockBeer);
    });
  });

  describe('onOpenDetail', () => {
    it('should emit openDetail event', () => {
      spyOn(component.openDetail, 'emit');
      component.onOpenDetail();
      (expect(component.openDetail.emit) as any).toHaveBeenCalledWith(mockBeer);
    });
  });

  describe('lazy loading behavior', () => {
    it('should initialize intersection observer on init', () => {
      const observeSpy = spyOn(IntersectionObserver.prototype, 'observe');
      component.ngOnInit();
      (expect(observeSpy) as any).toHaveBeenCalled();
    });

    it('should disconnect observer on destroy', () => {
      const disconnectSpy = spyOn(IntersectionObserver.prototype, 'disconnect');
      component.ngOnDestroy();
      (expect(disconnectSpy) as any).toHaveBeenCalled();
    });
  });

  describe('image loading', () => {
    it('should display fallback image initially', () => {
      const img = fixture.nativeElement.querySelector('img[alt="' + mockBeer.name + '"]');
      (expect(img.src) as any).toContain('placehold.co');
    });
  });
});