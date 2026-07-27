import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(text: string | null | undefined, term: string | null | undefined): SafeHtml {
    const safeText = escapeHtml(text ?? '');
    const trimmedTerm = term?.trim();

    if (!trimmedTerm) {
      return this.sanitizer.bypassSecurityTrustHtml(safeText);
    }

    const regex = new RegExp(`(${escapeRegExp(trimmedTerm)})`, 'gi');
    const highlighted = safeText.replace(regex, '<mark>$1</mark>');
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
