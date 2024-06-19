import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { AllTipoCuenta, ApiResponseCuenta, CreateCuenta, CuentaIdClient, PaginadoCuenta } from "@models/rapidiario/cuenta.model";
import { TokenService } from "@services/token.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class CuentaService {

  apiUrl = environment.url_api;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  getCuentaIdCliente(idCliente: number) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<CuentaIdClient>(`${environment.url_api}/Cuenta/Get_cuenta?I_PERSON_ID=${idCliente}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  getAllCuenta(type: string | null | undefined, filtro: string | null | undefined, index: number, pagezise: number, sortField: number, sortOrder: string) {
    const token: string = this.tokenService.getToken() ?? '';
    const page: number = index + 1;
    return this.http.get<PaginadoCuenta>(`${environment.url_api}/Cuenta/Get_paginado_cuenta?I_PAGE_NUMBER=${page}&I_PAGE_SIZE=${pagezise}&V_FILTER_TYPE=${type}&V_FILTER_VALUE=${filtro}&I_SORT_BY_FIELD=${sortField}&V_SORT_ORDER=${sortOrder}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getAllTipoCuenta() {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<AllTipoCuenta>(`${environment.url_api}/TipoCuenta/Get_lista_tipos_cuenta`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  createCuenta(data: Partial<CreateCuenta>) {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.post<CreateCuenta>(`${environment.url_api}/Cuenta/Post_new_cuenta`, data, {
      headers: {
        observe: 'response',
        Authorization: `Bearer ${token}`
      }
    });

  }

  getCuentaByDni(nroDocumento: string): Observable<ApiResponseCuenta> {
    const token: string = this.tokenService.getToken() ?? '';

    return this.http.get<ApiResponseCuenta>(`${environment.url_api}/Cuenta/Get_pagina_cuenta?V_FILTER_TYPE=NRO_DOC&V_FILTER_VALUE=${nroDocumento}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

  }
}
