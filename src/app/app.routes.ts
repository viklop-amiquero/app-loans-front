import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './auth/pages/login/login.component';

import { ListAppComponent } from './auth/components/list-app/list-app.component';
import { NavComponent } from './admin/components/nav/nav.component';
import { PageNotFoundComponent } from './admin/pages/page-not-found/page-not-found.component';

import { UserComponent } from './auth/components/user/user.component';
import { authListAppGuard } from './admin/guards/auth-list-app.guard';
import { InteresComponent } from './rapidiario/interes/interes.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,

  },
  {
    path: 'list-app',
    canActivate: [authListAppGuard],
    component: ListAppComponent,
  },
  {
    path: 'rapidiario',
    component: NavComponent,
    children: [
      { path: '', redirectTo: 'rapidiario/inicio', pathMatch: 'full' },
      { path: 'inicio', component: DashboardComponent },
      { path: 'usuarios', component: UserComponent },
      { path: 'roles',
        children: [
          {
            path: '',
            loadChildren: () => import('./auth/components/role/role.routes').then((m) => m.routes),
          }
        ]
      },
      {
        path: 'interes', children: [
          {
            path: '',
            component: InteresComponent
          }]
      },
      { path: 'colaborador',
      children: [
          {
            path: '',
            loadChildren: () => import('./app-persona/app-persona.routes').then((m) => m.routes),
          }
        ]
      },
      { path: 'finanzas',
        loadChildren: () => import('./rapidiario/rapidiario.routes').then((m) => m.routes),
      }
    ],
    canActivate: [authListAppGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  }
];


