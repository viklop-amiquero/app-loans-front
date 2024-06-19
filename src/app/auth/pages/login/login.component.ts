import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ LoginFormComponent, MatToolbarModule, MatButtonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {

  constructor(
    private Titulo : Title
  ){
    Titulo.setTitle('Financiera del Señor Cautivo')
  }
  // Obtén la fecha actual
  fechaActual =new Date();
  anio = `${this.fechaActual.getFullYear()}`
}
