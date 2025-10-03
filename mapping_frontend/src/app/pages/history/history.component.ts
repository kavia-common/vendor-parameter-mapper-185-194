import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Vendor } from '../../services/api.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './history.component.html',
})
export class HistoryComponent {
  vendors: Vendor[] = [];
  vendorId = '';
  mappingId = '';
  entries: any[] = [];
  loading = false;
  error?: string;

  constructor(private api: ApiService) {
    this.api.listVendors().subscribe(vs => this.vendors = vs);
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.api.listHistory({
      vendor_id: this.vendorId || undefined,
      mapping_id: this.mappingId || undefined
    }).subscribe({
      next: (rows) => { this.entries = rows; this.loading = false; },
      error: () => { this.error = 'Failed to load history'; this.loading = false; }
    });
  }
}
