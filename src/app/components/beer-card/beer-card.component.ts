import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beer } from '../../models/beer.model';
import { LAZY_LOADING_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-beer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beer-card.component.html',
  styleUrls: ['./beer-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BeerCardComponent implements OnInit, OnDestroy {
  @Input() beer!: Beer;
  @Output() toggleFavorite = new EventEmitter<Beer>();
  @Output() openDetail = new EventEmitter<Beer>();

  fallbackImage = 'https://placehold.co/150x300/f8f8f8/b0b0b0?text=Beer+Bottle&font=lato';
  imageSrc = this.fallbackImage;
  private intersectionObserver?: IntersectionObserver;
  private static activeRequests = 0;
  private static maxConcurrentRequests = LAZY_LOADING_CONSTANTS.MAX_CONCURRENT_REQUESTS;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.setupLazyLoading();
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupLazyLoading() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadRealImage();
            this.intersectionObserver?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: LAZY_LOADING_CONSTANTS.ROOT_MARGIN
      }
    );

    const imageContainer = this.elementRef.nativeElement.querySelector('.image-container');
    if (imageContainer) {
      this.intersectionObserver.observe(imageContainer);
    }
  }

  private async loadRealImage() {
    if (this.beer.image_url && this.imageSrc === this.fallbackImage) {
      while (BeerCardComponent.activeRequests >= BeerCardComponent.maxConcurrentRequests) {
        await new Promise(resolve => setTimeout(resolve, LAZY_LOADING_CONSTANTS.REQUEST_THROTTLE_MS));
      }

      BeerCardComponent.activeRequests++;

      try {
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            this.imageSrc = this.beer.image_url!;
            this.cdr.markForCheck();
            resolve();
          };
          img.onerror = () => {
            reject();
          };
          img.src = this.beer.image_url!;
        });
      } finally {
        BeerCardComponent.activeRequests--;
      }
    }
  }

  onToggleFavorite() {
    this.toggleFavorite.emit(this.beer);
  }

  onOpenDetail() {
    this.openDetail.emit(this.beer);
  }
}