import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VendorsComponent } from './pages/vendors/vendors.component';
import { MappingsComponent } from './pages/mappings/mappings.component';
import { HistoryComponent } from './pages/history/history.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, title: 'Dashboard' },
  { path: 'vendors', component: VendorsComponent, title: 'Vendors' },
  { path: 'mappings', component: MappingsComponent, title: 'Mappings' },
  { path: 'history', component: HistoryComponent, title: 'History' },
  { path: '**', redirectTo: '' }
];
