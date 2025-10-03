import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const g: any = (typeof globalThis !== 'undefined') ? globalThis : {};
    const docEl = g?.document?.documentElement as HTMLElement | undefined;
    if (!docEl) return;
    const c = environment.theme.colors;
    docEl.style.setProperty('--op-primary', c.primary);
    docEl.style.setProperty('--op-secondary', c.secondary);
    docEl.style.setProperty('--op-success', c.success);
    docEl.style.setProperty('--op-error', c.error);
    docEl.style.setProperty('--op-background', c.background);
    docEl.style.setProperty('--op-surface', c.surface);
    docEl.style.setProperty('--op-text', c.text);
  }
}
