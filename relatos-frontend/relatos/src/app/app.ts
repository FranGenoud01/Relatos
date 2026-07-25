import { Component } from '@angular/core';

import { ShellComponent } from './layout/shell/shell';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {}
