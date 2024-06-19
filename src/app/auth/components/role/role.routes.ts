import { Routes } from '@angular/router';
import { RoleComponent } from './components/role/role.component';
import { RoleFormComponent } from './components/role-form/role-form.component';

export const routes: Routes = [
  {
    path: '',
    component: RoleComponent
  },
  {
    path: 'create',
    component: RoleFormComponent
  },
  {
    path: 'edit',
    component: RoleFormComponent
  }
];
