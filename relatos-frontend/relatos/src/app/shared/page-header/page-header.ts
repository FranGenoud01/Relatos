import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './page-header.html',
  styleUrls: ['./page-header.css'],
})
export class PageHeaderComponent {
  icon = input<string | undefined>(undefined);
  title = input.required<string>();
  subtitle = input<string | undefined>(undefined);
}
