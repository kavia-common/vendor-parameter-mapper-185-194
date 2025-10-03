import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ParameterMapping, ParameterMappingCreate, ParameterMappingUpdate, Vendor } from '../../services/api.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-mappings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mappings.component.html',
})
export class MappingsComponent implements OnInit {
  vendors: Vendor[] = [];
  selectedVendorId = '';
  namespaceFilter = '';
  mappings: ParameterMapping[] = [];
  loading = false;
  error?: string;

  showModal = false;
  editing?: ParameterMapping;
  modalVendorId = '';
  modalNamespace = 'default';
  modalRulesText = 'input_param,output_param,transform?';

  constructor(private api: ApiService, private notify: NotifyService) {}

  ngOnInit(): void {
    this.api.listVendors().subscribe(vs => this.vendors = vs);
    this.fetch();
  }

  fetch(): void {
    this.loading = true;
    this.api.listMappings({
      vendor_id: this.selectedVendorId || undefined,
      namespace: this.namespaceFilter || undefined
    }).subscribe({
      next: (list) => { this.mappings = list; this.loading = false; },
      error: () => { this.error = 'Failed to load mappings'; this.loading = false; }
    });
  }

  openCreate(): void {
    this.editing = undefined;
    this.modalVendorId = this.selectedVendorId || '';
    this.modalNamespace = this.namespaceFilter || 'default';
    this.modalRulesText = 'input_param,output_param,transform?';
    this.showModal = true;
  }

  openEdit(m: ParameterMapping): void {
    this.editing = m;
    this.modalVendorId = m.vendor_id;
    this.modalNamespace = m.namespace;
    // convert rules to CSV lines
    this.modalRulesText = m.rules.map(r => `${r.input_param},${r.output_param},${r.transform ?? ''}`).join('\n');
    this.showModal = true;
  }

  parseRules(text: string) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    return lines.map(line => {
      const [input_param, output_param, transform] = line.split(',').map(s => (s ?? '').trim());
      if (!input_param || !output_param) throw new Error('Each rule must have input_param and output_param');
      return { input_param, output_param, transform: transform || undefined };
    });
  }

  save(): void {
    try {
      const rules = this.parseRules(this.modalRulesText);
      if (!this.editing) {
        const payload: ParameterMappingCreate = {
          vendor_id: this.modalVendorId,
          namespace: this.modalNamespace || 'default',
          rules
        };
        this.api.createMapping(payload).subscribe({
          next: () => { this.showModal = false; this.fetch(); this.notify.info('Mapping created'); },
          error: (e) => this.notify.error(e?.error?.message || 'Failed to create mapping')
        });
      } else {
        const payload: ParameterMappingUpdate = {
          namespace: this.modalNamespace,
          rules
        };
        this.api.updateMapping(this.editing.id, payload).subscribe({
          next: () => { this.showModal = false; this.fetch(); this.notify.info('Mapping updated'); },
          error: (e) => this.notify.error(e?.error?.message || 'Failed to update mapping')
        });
      }
    } catch (err: any) {
      this.notify.error(err?.message || 'Invalid rules format');
    }
  }

  delete(m: ParameterMapping): void {
    if (!this.notify.confirm(`Delete mapping ${m.id}?`)) return;
    this.api.deleteMapping(m.id).subscribe({
      next: () => { this.fetch(); this.notify.info('Mapping deleted'); },
      error: () => this.notify.error('Failed to delete mapping')
    });
  }
}
