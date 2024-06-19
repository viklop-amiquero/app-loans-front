import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { DashboardService } from '@services/rapidiario/dashboard.service';
import { AppRolMenuService } from '@services/security/approlmenu/approlmenu.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatListModule, MatExpansionModule, MatCardModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  // Dashboard
  mayorIngresoDia: number = 0;
  mayorDesembolsoDia: number = 0;
  sumIngresosDia: number = 0;
  sumDesembolsosDia: number = 0;
  sumGastosDia: number = 0;
  ingresosDia: number[] = [];
  ingresosMes: number = 0;
  desembolsosDia: number[] = [];
  desembolsosMes: number = 0;
  gastosDia: number[] = [];
  gastosMes: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appRolMenuService: AppRolMenuService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(){
    this.getDashboard();
  }

  // Dashboard
  getDashboard() {
    this.dashboardService.getDashboard().subscribe(data => {
      this.mayorIngresoDia = data.value.v_MAX_INCOME_DAY;
      this.mayorDesembolsoDia = data.value.v_MAX_DISBURSEMENT_DAY;
      this.sumIngresosDia = data.value.v_SUM_INCOMES_DAY;
      this.sumDesembolsosDia = data.value.v_SUM_DISBURSEMENTS_DAY;
      this.sumGastosDia = data.value.v_SUM_EXPENSES_DAY;
      this.ingresosDia = data.value.v_INCOMES_DAY;
      this.ingresosMes = data.value.v_INCOMES_MONTH;
      this.desembolsosDia = data.value.v_DISBURSEMENTS_DAY;
      this.desembolsosMes = data.value.v_DISBURSEMENTS_MONTH;
      this.gastosDia = data.value.v_EXPENSES_DAY;
      this.gastosMes = data.value.v_EXPENSES_MONTH;
    });
  }
}
