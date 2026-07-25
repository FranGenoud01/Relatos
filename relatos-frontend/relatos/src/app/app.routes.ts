import { Routes } from '@angular/router';

import { EstudiarExamenComponent } from './pages/estudiar-examen/estudiar-examen';
import { AportarExamenComponent } from './pages/aportar-examen/aportar-examen';
import { ExplorarExamenComponent } from './pages/explorar-examen/explorar-examen';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminPendientesComponent } from './pages/admin-pendientes/admin-pendientes';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'estudiar' },
  { path: 'estudiar', component: EstudiarExamenComponent, title: 'Estudiar · Relatos' },
  { path: 'aportar', component: AportarExamenComponent, title: 'Aportar · Relatos' },
  { path: 'explorar', component: ExplorarExamenComponent, title: 'Explorar · Relatos' },
  { path: 'estadisticas', component: EstadisticasComponent, title: 'Estadísticas · Relatos' },
  { path: 'login', component: LoginComponent, title: 'Ingresar · Relatos' },
  { path: 'registro', component: RegisterComponent, title: 'Crear cuenta · Relatos' },
  {
    path: 'admin/pendientes',
    component: AdminPendientesComponent,
    canActivate: [adminGuard],
    title: 'Moderación · Relatos',
  },
  {
    path: 'admin/contenido',
    loadComponent: () =>
      import('./pages/admin-contenido/admin-contenido').then((m) => m.AdminContenidoComponent),
    canActivate: [adminGuard],
    title: 'Gestión de contenido · Relatos',
  },
  { path: '**', redirectTo: 'estudiar' },
];
