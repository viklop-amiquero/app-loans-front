import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  // Obtén la fecha actual
  fechaActual =new Date();
  anio = `${this.fechaActual.getFullYear()}`
}
