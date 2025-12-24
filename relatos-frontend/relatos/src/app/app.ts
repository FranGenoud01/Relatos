import { Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';

import { EstudiarExamenComponent } from './pages/estudiar-examen/estudiar-examen';
import { AportarExamenComponent } from './pages/aportar-examen/aportar-examen';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, MatTabsModule, EstudiarExamenComponent, AportarExamenComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {}
