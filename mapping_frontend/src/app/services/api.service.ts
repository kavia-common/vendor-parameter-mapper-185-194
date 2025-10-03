import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

// PUBLIC_INTERFACE
export interface Vendor {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  is_active: boolean;
}

// PUBLIC_INTERFACE
export interface VendorCreate {
  name: string;
  code: string;
  description?: string | null;
  is_active?: boolean;
}

// PUBLIC_INTERFACE
export interface VendorUpdate {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

// PUBLIC_INTERFACE
export interface MappingRuleBase {
  input_param: string;
  output_param: string;
  transform?: string | null;
}

// PUBLIC_INTERFACE
export interface ParameterMapping {
  id: string;
  vendor_id: string;
  namespace: string;
  rules: MappingRuleBase[];
  version: number;
  created_at: string;
  updated_at: string;
}

// PUBLIC_INTERFACE
export interface ParameterMappingCreate {
  vendor_id: string;
  namespace?: string;
  rules: MappingRuleBase[];
}

// PUBLIC_INTERFACE
export interface ParameterMappingUpdate {
  namespace?: string;
  rules?: MappingRuleBase[];
}

// PUBLIC_INTERFACE
export interface QueryResolutionRequest {
  vendor_id: string;
  namespace?: string;
  parameters: string[];
  values?: Record<string, any>;
}

// PUBLIC_INTERFACE
export interface QueryResolutionResult {
  vendor_id: string;
  namespace: string;
  resolved: Record<string, any>;
  rules_used: MappingRuleBase[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl.replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  // Vendors
  // PUBLIC_INTERFACE
  listVendors(): Observable<Vendor[]> {
    /** List vendors from backend */
    return this.http.get<Vendor[]>(`${this.base}/vendors/`);
  }

  // PUBLIC_INTERFACE
  getVendor(id: string): Observable<Vendor> {
    /** Get vendor by id */
    return this.http.get<Vendor>(`${this.base}/vendors/${id}`);
  }

  // PUBLIC_INTERFACE
  createVendor(payload: VendorCreate): Observable<Vendor> {
    /** Create vendor */
    return this.http.post<Vendor>(`${this.base}/vendors/`, payload);
  }

  // PUBLIC_INTERFACE
  updateVendor(id: string, payload: VendorUpdate): Observable<Vendor> {
    /** Update vendor */
    return this.http.patch<Vendor>(`${this.base}/vendors/${id}`, payload);
  }

  // PUBLIC_INTERFACE
  deleteVendor(id: string): Observable<void> {
    /** Delete vendor */
    return this.http.delete<void>(`${this.base}/vendors/${id}`);
  }

  // Mappings
  // PUBLIC_INTERFACE
  listMappings(filters?: { vendor_id?: string; namespace?: string }): Observable<ParameterMapping[]> {
    /** List mappings with optional filters */
    let params = new HttpParams();
    if (filters?.vendor_id) params = params.set('vendor_id', filters.vendor_id);
    if (filters?.namespace) params = params.set('namespace', filters.namespace);
    return this.http.get<ParameterMapping[]>(`${this.base}/mappings/`, { params });
  }

  // PUBLIC_INTERFACE
  getMapping(id: string): Observable<ParameterMapping> {
    /** Get mapping by id */
    return this.http.get<ParameterMapping>(`${this.base}/mappings/${id}`);
  }

  // PUBLIC_INTERFACE
  createMapping(payload: ParameterMappingCreate): Observable<ParameterMapping> {
    /** Create mapping */
    return this.http.post<ParameterMapping>(`${this.base}/mappings/`, payload);
  }

  // PUBLIC_INTERFACE
  updateMapping(id: string, payload: ParameterMappingUpdate): Observable<ParameterMapping> {
    /** Update mapping */
    return this.http.patch<ParameterMapping>(`${this.base}/mappings/${id}`, payload);
  }

  // PUBLIC_INTERFACE
  deleteMapping(id: string): Observable<void> {
    /** Delete mapping */
    return this.http.delete<void>(`${this.base}/mappings/${id}`);
  }

  // History
  // PUBLIC_INTERFACE
  listHistory(filters?: { vendor_id?: string; mapping_id?: string }): Observable<any[]> {
    /** List mapping history entries */
    let params = new HttpParams();
    if (filters?.vendor_id) params = params.set('vendor_id', filters.vendor_id);
    if (filters?.mapping_id) params = params.set('mapping_id', filters.mapping_id);
    return this.http.get<any[]>(`${this.base}/history/`, { params });
  }

  // Resolve
  // PUBLIC_INTERFACE
  resolve(req: QueryResolutionRequest): Observable<QueryResolutionResult> {
    /** Resolve vendor mapping for given parameters */
    return this.http.post<QueryResolutionResult>(`${this.base}/resolve/`, req);
  }
}
