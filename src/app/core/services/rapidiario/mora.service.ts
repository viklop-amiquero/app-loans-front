import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ListCancMora, ListMora, ListTiposCancMora, UpdateMora } from '@models/rapidiario/mora.model';
import { TokenService } from '@services/token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoraService {

  apiUrl = environment.url_api;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  getListMoraCredit(idCredit: number) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListMora>(`${environment.url_api}/Mora/Get_lista_mora_credito?I_CREDIT_ID=${idCredit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getListTiposCancMora() {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListTiposCancMora>(`${environment.url_api}/Mora/Get_lista_total_tipos_canc_mora`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getListCancMora(idMora: number) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListCancMora>(`${environment.url_api}/Mora/Get_lista_total_canc_mora?I_MORA_ID=${idMora}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getMora(id: number): Observable<ListMora> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<ListMora>(`${environment.url_api}/Mora/Get_obtener_mora?V_CUOTA_ID=${id}`
    , {
      headers: {
        Authorization: `Bearer ${token}`
        }
      }
    );
  }

  updateMora(data: Partial<UpdateMora>) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.patch<UpdateMora>(`${environment.url_api}/Mora/Patch_update_mora`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
