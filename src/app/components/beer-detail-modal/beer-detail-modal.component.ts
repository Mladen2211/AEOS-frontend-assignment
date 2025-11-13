import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Beer } from '../../models/beer.model';
import { BeerService } from '../../services/beer.service';

@Component({
  selector: 'app-beer-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './beer-detail-modal.component.html',
  styleUrls: ['./beer-detail-modal.component.css']
})
export class BeerDetailModalComponent implements OnChanges {
  @Input() beer: Beer | null = null;
  @Output() close = new EventEmitter<void>();

  fullBeer: Beer | null = null;
  loading = false;
  activeTab = 'overview';
  fallbackImage = 'https://placehold.co/150x300/f8f8f8/b0b0b0?text=Beer+Bottle&font=lato';

  constructor(private beerService: BeerService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['beer'] && this.beer) {
      this.loadFullBeerDetails();
    }
  }

  private loadFullBeerDetails() {
    if (!this.beer) return;

    this.loading = true;
    this.beerService.getBeerById(this.beer.id).subscribe({
      next: (fullBeer) => {
        this.fullBeer = fullBeer;
        this.loading = false;
      },
      error: (error) => {
        this.fullBeer = this.beer;
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onClose() {
    this.close.emit();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.fallbackImage) {
      img.src = this.fallbackImage;
    }
  }
}