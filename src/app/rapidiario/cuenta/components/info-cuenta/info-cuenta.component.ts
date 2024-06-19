import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatLabel } from '@angular/material/form-field';
import { ClientData } from '@models/rapidiario/cuenta.model';
import { DataService } from '@services/data.service';
import { CuentaService } from '@services/rapidiario/cuenta.service';


@Component({
  selector: 'app-info-cuenta',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatLabel
  ],
  templateUrl: './info-cuenta.component.html',
  styleUrl: './info-cuenta.component.scss',
})
export class InfoCuentaComponent implements OnInit{
  constructor(
    private dataService : DataService,
    private cuentaService: CuentaService,
  ){
  }
  idCliente:number=0;
  infoCuenta:any;

  dataCuenta: ClientData ={
    i_PERSON_ID: 0,
    v_NRO_DOCUMENT: '',
    v_FIRST_NAME: '',
    v_SECOND_NAME: null,
    v_PATERNAL_LAST_NAME: '',
    v_MOTHER_LAST_NAME:   '',
    cuentas_cliente: []
  }


  ngOnInit(): void {
    this.dataService.data.subscribe(data => {
      this.idCliente = data;
    });
    if(this.idCliente){
      this.getCuentaIdCliente();
    }
  }
  tipoCuenta(idType:number):string{
    if(idType==1){
      return "Ahorro";
    }
    if(idType==2){
      return "Crédito";
    }
      return "Aporte";
  }
  getCuentaIdCliente(){
    this.cuentaService.getCuentaIdCliente(this.idCliente).subscribe({
      next: (data) =>{
        this.infoCuenta=data.value[0].cuentas_cliente;
        this.dataCuenta=data.value[0];
      }
    })
  }
}
