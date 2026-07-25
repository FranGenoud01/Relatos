import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

const THEME_STORAGE_KEY = 'theme';
const DARK_CLASS = 'dark-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly darkModeSubject = new BehaviorSubject<boolean>(this.readInitialTheme());
  readonly isDarkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    this.applyTheme(this.darkModeSubject.value);
  }

  get isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggle(): void {
    this.setDarkMode(!this.darkModeSubject.value);
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    this.applyTheme(isDark);
    if (this.isBrowser) {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    }
  }

  private readInitialTheme(): boolean {
    return this.isBrowser && localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
  }

  private applyTheme(isDark: boolean): void {
    if (this.isBrowser) {
      this.document.body.classList.toggle(DARK_CLASS, isDark);
    }
  }
}
