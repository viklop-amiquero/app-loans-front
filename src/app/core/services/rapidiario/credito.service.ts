import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Credito, CreditoNew, ApiResponseCredito } from '../../models/rapidiario/credito.model'
import { environment } from '../../../../environments/environment';
import { TokenService } from "@services/token.service";

@Injectable({
  providedIn: 'root'
})

export class CreditoService {
  private endpoint: string = environment.url_api
  private apiUrl: string = this.endpoint + '/Credito'

  constructor(
    private http: HttpClient,
    private tokenService: TokenService) { }

  getCreditoFiltered(type: string, value: number): Observable<ApiResponseCredito> {
    const token: string = this.tokenService.getToken() ?? '';

    return this.http.get<ApiResponseCredito>(`${this.apiUrl}/Get_pagina_credito?V_FILTER_TYPE=${type}&V_FILTER_VALUE=${value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  getCredito(idCredito: number): Observable<Credito[]> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get<Credito[]>(`${this.apiUrl}/Get_credito/${idCredito}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  crearCredito(data: CreditoNew): Observable<CreditoNew> {

    const token: string = this.tokenService.getToken() ?? '';
    return this.http.post<CreditoNew>(`${this.apiUrl}/Post_new_credito`, data, {
      headers: {
        observe: 'response',
        Authorization: `Bearer ${token}`
      }
    })
  }

  deleteCredito(idCredito: number, modelo: Credito): Observable<Credito> {
    const token: string = this.tokenService.getToken() ?? '';

    return this.http.put<Credito>(`${this.apiUrl}/Put_delete_credito/${idCredito}`, modelo, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
