import { Component, Input, OnInit } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import moment from 'moment'
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PaginatorService } from '@services/paginator.service';

export interface Cuota {
    numeroCuota: number
    fecha: string
    saldo: number
    capital: number
    interes: number
    montoCuota: number
}

@Component({
    selector: 'app-credito-table',
    standalone: true,
    imports: [MatTableModule, MatPaginatorModule,DatePipe],
    templateUrl: './credito-table.component.html',
    styleUrl: './credito-table.component.scss',
    providers: [
      {provide: MatPaginatorIntl, useClass: PaginatorService}
    ],
})
export class CreditoTableComponent implements OnInit {

    cuotas: Cuota[] = []

    @Input()
    secondFormGroup !: FormGroup

    displayedColumns: string[] = ['numero_cuota','fecha', 'saldo', 'capital', 'interes', 'cuota'];

    dataSource = new MatTableDataSource<Cuota>(this.cuotas);

    ngOnInit(): void {
    }

    calcularCuotas() {
        this.cuotas = [];
        const montoPrestamo = Number(this.secondFormGroup.value.montoPrestamo)
        const tasaInteres = Number(this.secondFormGroup.value.tasaInteres) / 100
        const plazo = Number(this.secondFormGroup.value.plazo)
        let fechaDesembolso = moment(this.secondFormGroup.value.fechaDesembolso).format('YYYY-MM-DD HH:mm:ss.sss')
        const fechaVencimiento = moment(this.secondFormGroup.value.fechaVencimiento).format('YYYY-MM-DD HH:mm:ss.sss')
        const frecuenciaPago = this.secondFormGroup.value.frecuenciaPago

        let saldo = montoPrestamo
        let montoCuota = montoPrestamo * ((tasaInteres * Math.pow((1 + tasaInteres), plazo)) / (Math.pow((1 + tasaInteres), plazo) - 1))

        for (let i = 0; i < plazo; i++) {
            let interes = saldo * tasaInteres
            let capital = montoCuota - interes
            saldo -= capital
            const cuota = {
                numeroCuota: i+1,
                fecha: fechaDesembolso,
                saldo: Number(saldo.toFixed(2)),
                capital: Number(capital.toFixed(2)),
                interes: Number(interes.toFixed(2)),
                montoCuota: Number(montoCuota.toFixed(2))
            }

            this.cuotas.push(cuota)

            if (frecuenciaPago === "1") {
                fechaDesembolso = moment(fechaDesembolso).add(1, 'day').toDate().toString();
            } else if (frecuenciaPago === "2") {
                fechaDesembolso = moment(fechaDesembolso).add(1, 'week').toDate().toString();
            } else if (frecuenciaPago === "3") {
                fechaDesembolso = moment(fechaDesembolso).add(1, 'month').toDate().toString();
            }

        }

        this.dataSource.data = this.cuotas;
    }

}
