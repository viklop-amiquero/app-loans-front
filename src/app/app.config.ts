import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import {  MatPaginatorModule } from '@angular/material/paginator';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

import {HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ReactiveFormsModule } from '@angular/forms';

import { ToastrModule  } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule, MatTableDataSource, MatTableModule, ReactiveFormsModule, ToastrModule.forRoot(), MatPaginatorModule),
    provideAnimations()
]

};
