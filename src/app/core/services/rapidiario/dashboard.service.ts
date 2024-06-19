import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "@environments/environment";
import { Dashboard } from "@models/rapidiario/dashboard.model";
import { TokenService } from "@services/token.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  getDashboard() {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<Dashboard>(`${environment.url_api}/Application/Get_ingresos_desembolsos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
