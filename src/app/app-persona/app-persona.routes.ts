import { Routes } from '@angular/router';
import { ColaboradorComponent } from './colaborador/components/colaborador/colaborador.component';
import { ColaboradorFormComponent } from './colaborador/components/colaborador-form/colaborador-form.component';

export const routes: Routes = [
  {
    path: '',
    component: ColaboradorComponent
  },
  {
    path: 'create',
    component: ColaboradorFormComponent
  },
  {
    path: 'edit',
    component: ColaboradorFormComponent
  }
];
