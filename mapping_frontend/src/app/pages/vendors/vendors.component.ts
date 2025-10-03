import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Vendor, VendorCreate, VendorUpdate } from '../../services/api.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendors.component.html',
})
export class VendorsComponent implements OnInit {
  loading = false;
  vendors: Vendor[] = [];
  showModal = false;
  editing?: Vendor;

  // expose explicit fields for template binding (avoid casts in template)
  formName = '';
  formCode = '';
  formDescription: string | null | undefined = '';
  formIsActive = true;

  error?: string;

  constructor(private api: ApiService, private notify: NotifyService) {}

  ngOnInit(): void {
    this.fetch();
  }

  private toCreatePayload(): VendorCreate {
    return {
      name: this.formName,
      code: this.formCode,
      description: this.formDescription ?? '',
      is_active: this.formIsActive,
    };
  }

  private toUpdatePayload(): VendorUpdate {
    return {
      name: this.formName,
      description: this.formDescription ?? '',
      is_active: this.formIsActive,
    };
  }

  fetch(): void {
    this.loading = true;
    this.api.listVendors().subscribe({
      next: (list) => { this.vendors = list; this.loading = false; },
      error: () => { this.error = 'Failed to load vendors'; this.loading = false; }
    });
  }

  openCreate(): void {
    this.editing = undefined;
    this.formName = '';
    this.formCode = '';
    this.formDescription = '';
    this.formIsActive = true;
    this.showModal = true;
  }

  openEdit(v: Vendor): void {
    this.editing = v;
    this.formName = v.name;
    this.formCode = v.code; // code is immutable on backend; shown but not editable
    this.formDescription = v.description ?? '';
    this.formIsActive = v.is_active;
    this.showModal = true;
  }

  save(): void {
    this.error = undefined;
    if (!this.formName || (!this.editing && !this.formCode)) {
      this.error = 'Name and Code are required';
      return;
    }
    if (!this.editing) {
      const payload = this.toCreatePayload();
      this.api.createVendor(payload).subscribe({
        next: () => { this.showModal = false; this.fetch(); this.notify.info('Vendor created'); },
        error: (e) => { this.error = e?.error?.message || 'Failed to create vendor'; }
      });
    } else {
      const payload = this.toUpdatePayload();
      this.api.updateVendor(this.editing.id, payload).subscribe({
        next: () => { this.showModal = false; this.fetch(); this.notify.info('Vendor updated'); },
        error: (e) => { this.error = e?.error?.message || 'Failed to update vendor'; }
      });
    }
  }

  delete(v: Vendor): void {
    if (!this.notify.confirm(`Delete vendor "${v.name}"?`)) return;
    this.api.deleteVendor(v.id).subscribe({
      next: () => { this.fetch(); this.notify.info('Vendor deleted'); },
      error: () => this.notify.error('Failed to delete vendor')
    });
  }
}
