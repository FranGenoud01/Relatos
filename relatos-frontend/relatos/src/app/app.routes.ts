import { Routes } from '@angular/router';

import { EstudiarExamenComponent } from './pages/estudiar-examen/estudiar-examen';
import { AportarExamenComponent } from './pages/aportar-examen/aportar-examen';
import { ExplorarExamenComponent } from './pages/explorar-examen/explorar-examen';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'estudiar' },
  { path: 'estudiar', component: EstudiarExamenComponent, title: 'Estudiar · Relatos' },
  { path: 'aportar', component: AportarExamenComponent, title: 'Aportar · Relatos' },
  { path: 'explorar', component: ExplorarExamenComponent, title: 'Explorar · Relatos' },
  { path: 'login', component: LoginComponent, title: 'Ingresar · Relatos' },
  { path: 'registro', component: RegisterComponent, title: 'Crear cuenta · Relatos' },
  { path: '**', redirectTo: 'estudiar' },
];
