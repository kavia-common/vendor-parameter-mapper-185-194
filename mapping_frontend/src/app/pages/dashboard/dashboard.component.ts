import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, QueryResolutionRequest, QueryResolutionResult } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  vendorId = '';
  namespace = 'default';
  parametersText = '';
  valuesJson = '{\n  \n}';
  resolving = false;
  result?: QueryResolutionResult;
  error?: string;

  constructor(private api: ApiService) {}

  resolve(): void {
    this.error = undefined;
    this.result = undefined;

    const params = this.parametersText.split(',').map(s => s.trim()).filter(Boolean);
    let values: Record<string, any> | undefined = undefined;
    try {
      const parsed = JSON.parse(this.valuesJson || '{}');
      values = parsed;
    } catch {
      this.error = 'Values JSON is invalid.';
      return;
    }
    if (!this.vendorId || params.length === 0) {
      this.error = 'Please provide vendor_id and at least one parameter.';
      return;
    }
    const req: QueryResolutionRequest = {
      vendor_id: this.vendorId,
      namespace: this.namespace || undefined,
      parameters: params,
      values
    };
    this.resolving = true;
    this.api.resolve(req).subscribe({
      next: (res) => { this.result = res; this.resolving = false; },
      error: (e) => { this.error = e?.error?.message || 'Failed to resolve'; this.resolving = false; }
    });
  }
}
