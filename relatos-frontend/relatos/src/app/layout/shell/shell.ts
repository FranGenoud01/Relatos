import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

interface NavLink {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './shell.html',
  styleUrls: ['./shell.css'],
})
export class ShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly theme = inject(ThemeService);
  readonly auth = inject(AuthService);

  private readonly baseNavLinks: NavLink[] = [
    { path: '/estudiar', label: 'Estudiar', icon: 'menu_book' },
    { path: '/explorar', label: 'Explorar', icon: 'search' },
    { path: '/aportar', label: 'Aportar', icon: 'add_circle_outline' },
    { path: '/estadisticas', label: 'Estadísticas', icon: 'bar_chart' },
  ];

  private readonly currentUser = toSignal(this.auth.currentUser$, {
    initialValue: this.auth.currentUser,
  });

  readonly navLinks = computed<NavLink[]>(() => {
    if (this.currentUser()?.isAdmin) {
      return [
        ...this.baseNavLinks,
        { path: '/admin/pendientes', label: 'Moderación', icon: 'fact_check' },
        { path: '/admin/contenido', label: 'Contenido', icon: 'delete_sweep' },
      ];
    }
    return this.baseNavLinks;
  });

  readonly isMobile$: Observable<boolean> = this.breakpointObserver
    .observe(['(max-width: 600px)'])
    .pipe(map((state) => state.matches));

  logout(): void {
    this.auth.logout();
  }
}
