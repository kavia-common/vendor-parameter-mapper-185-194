import { Injectable, inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  private readonly platformId = inject(PLATFORM_ID);

  // PUBLIC_INTERFACE
  info(message: string): void {
    /** Show an informational message using a non-blocking fallback */
    if (isPlatformBrowser(this.platformId)) {
      console.info(message);
    }
  }

  // PUBLIC_INTERFACE
  error(message: string): void {
    /** Show an error message using a non-blocking fallback */
    if (isPlatformBrowser(this.platformId)) {
      console.error(message);
    }
  }

  // PUBLIC_INTERFACE
  confirm(message: string): boolean {
    /** Ask a yes/no question; returns boolean. Uses globalThis.confirm only when in browser. */
    const g: any = (typeof globalThis !== 'undefined') ? globalThis : {};
    if (isPlatformBrowser(this.platformId) && typeof g.confirm === 'function') {
      return g.confirm(message);
    }
    // Fallback default to true for non-browser contexts
    this.info(`Confirm requested: ${message} (auto-approving in non-browser context)`);
    return true;
  }
}
